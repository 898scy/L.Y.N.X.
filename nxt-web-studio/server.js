const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// JSONの受け取りとCORSの許可、publicフォルダの静的ファイル配信
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// コンパイル要求を受け付けるAPIエンドポイント
app.post('/compile', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'NXC code is required' });
    }

    // 重複を避けるための一時ファイル名を生成
    const fileId = crypto.randomBytes(8).toString('hex');
    const nxcFilePath = path.join(os.tmpdir(), `${fileId}.nxc`);
    const rxeFilePath = path.join(os.tmpdir(), `${fileId}.rxe`);

    try {
        // 1. 送られてきたC言語(NXC)コードを一時ファイルに保存
        await fs.writeFile(nxcFilePath, code);

        // 2. nbcコマンドを実行してコンパイル（-Oオプションで出力ファイル名を指定）
        const compileCmd = `nbc -O="${rxeFilePath}" "${nxcFilePath}"`;
        
        await new Promise((resolve, reject) => {
            exec(compileCmd, (error, stdout, stderr) => {
                if (error) {
                    console.error("Compile Error:\n", stderr);
                    reject(stderr || stdout);
                } else {
                    resolve();
                }
            });
        });

        // 3. コンパイル成功時、生成された.rxeバイナリを読み込む
        const rxeBuffer = await fs.readFile(rxeFilePath);

        // 4. ブラウザにバイナリデータをそのまま返送する
        res.set('Content-Type', 'application/octet-stream');
        res.send(rxeBuffer);

    } catch (error) {
        // コンパイルエラー時はエラーテキストを返す
        res.status(500).json({ error: `Compilation failed:\n${error}` });
    } finally {
        // 5. ゴミが残らないように一時ファイルを削除
        try { await fs.unlink(nxcFilePath); } catch (e) {}
        try { await fs.unlink(rxeFilePath); } catch (e) {}
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser.`);
});