// const uInstruction = ["んち", "んちち", "んちっち", "んちちっち", "んちっちち", "んちっちっち", "んちちっちっち", "んちっちちっち"];
// const bInstruction = [">", "<", "+", "-", ".", ",", "[", "]"];

let draw = null;

const uInstruction = ['うんち', 'うんちち', 'うんちっち', 'うんちちっち', 'うんちっちち', 'うんちちっちち', 'うんちっちっち', 'うんちちっちっち'];

const bInstruction = ['>', '<', '+', '-', '.', ',', '[', ']'];

const utob = code => code.split('う').map(char => bInstruction[uInstruction.indexOf(`う${char}`)]).join('');

const btou = code => code.split('').map(char => uInstruction[bInstruction.indexOf(char)]).join('');

const runBF = code => {
    const size = 30000;
    let memories = new Int32Array(size);
    let pointer = 0;
    let output = [];

    let tryMax = 10000;
    let tryCnt = 0;
    let jump = 0;

    for (let i = 0, l = code.length; i < l; i ++) {
        tryCnt ++;

        switch (code[i]) {
            case '>':
                pointer ++;
                break;

            case '<':
                pointer --;
                break;

            case '+':
                memories[pointer] ++;
                break;

            case '-':
                memories[pointer] --;
                break;

            case '.':
                output.push(String.fromCharCode(memories[pointer]));
                break;

            case ',':
                break;

            case '[':
                if (memories[pointer] == 0) {
                    let c = 0;
                    i++;

                    while (!(c == 0 && code[i] == ']')) {
                        if (code[i] == '[') c ++;
                        if (code[i] == ']' && c > 0) c --;
                        i++;

                        if (code.length < i) {
                            console.log('[ERROR] beyond scope memory.');
                            break;
                        }
                    }
                }
                break;

            case ']':
                if (memories[pointer] != 0) {
                    let c = 0;
                    i--;

                    while (!(c == 0 && code[i] == '[')) {
                        if (code[i] == ']') c ++;
                        if (code[i] == '[' && c > 0) c --;
                        i--;

                        if (0 > i) {
                            console.log('[ERROR] beyond scope memory.');
                            break;
                        }
                    }
                }
                break;
        }

        if (tryCnt > tryMax) {
            console.log('[ERROR] Stack overflow tryMax');
            break;
        }

        draw(memories);
    }

    return {memories, output};
};

(() => {
    let flag = false;

    onload = () => {
        const button = document.querySelector('button');
        const canvas = document.querySelector('canvas');
        const ctx = canvas.getContext('2d');

        // メモリの動きを可視化する
        canvas.width = 1000;
        canvas.height = 150;

        draw = memories => {
            const width = canvas.width;
            const height = canvas.height;
            ctx.clearRect(0, 0, width, height);

            const memoryBoxSize = 22;
            const padding = 1;

            const line = width / (memoryBoxSize + padding * 2);
            const column = 12;

            let memoryIndex = 0;
            for (let y = 0; y < (column >> 0); y++) {
                for (let x = 0; x < (line >> 0); x++) {
                    const draw = {
                        x: x * (memoryBoxSize + padding * 2) + memoryBoxSize / 2 - padding,
                        y: y * (memoryBoxSize + padding * 2) + memoryBoxSize / 2 - padding
                    };

                    ctx.fillStyle = memories === undefined || memories[memoryIndex] === 0 ? '#e9e9e9' : '#0dc9b6';
                    ctx.fillRect(draw.x, draw.y, memoryBoxSize, memoryBoxSize);

                    // メモリを描画
                    const size = memories === undefined ? '-' : memories[memoryIndex];
                    ctx.fillStyle = size === '-' || size === 0 ? '#c6c6c6' : '#363636';
                    ctx.textAlign = 'center';
                    ctx.font = `${memoryBoxSize - 5}px 'Montserrat', sans-serif`;
                    ctx.fillText(size, draw.x + memoryBoxSize / 2, draw.y + memoryBoxSize - padding * 5);
                    memoryIndex++;
                }
            }
        };

        // 初期描画
        draw();

        // イベント設定
        button.addEventListener('click', () => {
            const textarea = document.querySelectorAll('textarea');
            const source = textarea[0].value;

            if (flag) {
                const result = btou(source);
                textarea[1].value = result; // `output:\n${result}`;
            } else {
                const result = runBF(utob(source));
                textarea[1].value = result.output.join(''); // `output:\n${result.output.join('')}\n\nmemories:\n${result.memories}`;
            }
        });

        document.body.addEventListener('keydown', event => {
            if (event.keyCode === 16) {
                button.innerText = 'うんち言語に変換';
                button.style.background = '#fc496d';
                flag = true;
            }
        });

        document.body.addEventListener('keyup', event => {
            if (event.keyCode === 16) {
                button.innerText = 'うんち言語を実行';
                button.style.background = '#0ac9b6';
                flag = false;
            }
        });
    };
})();
