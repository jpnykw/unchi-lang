const uInstruction = ["んち", "んちち", "んちっち", "んちちっち", "んちっちち", "んちっちっち", "んちちっちっち", "んちっちちっち"];
const bInstruction = [">", "<", "+", "-", ".", ",", "[", "]"];

const utob = code => code.split('う').map(char => bInstruction[uInstruction.indexOf(char)]).join('');

const btou = code => code.split('').map(char => `う${uInstruction[bInstruction.indexOf(char)]}`).join('');

const runBF = code => {
    const size = 30000;
    let memories = new Int32Array(size);
    let pointer = 0;
    let output = [];

    let tryMax = 10000;
    let tryCnt = 0;

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

                    while (!(c == 0 && code[i] == ']')) {
                        i ++;

                        if (code[i] == '[') c ++;
                        if (code[i] == ']' && c > 0) c --;

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

                    while (!(c == 0 && code[i] == '[')) {
                        i --;

                        if (code[i] == ']') c ++;
                        if (code[i] == '[' && c > 0) c --;

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
    }

    return {memories, output};
};

(() => {
    let flag = false;

    onload = () => {
        const button = document.querySelector('button');
        button.addEventListener('click', () => {
            const textarea = document.querySelectorAll('textarea');
            const source = textarea[0].value;

            if (flag) {
                const result = btou(source);
                textarea[1].value = `output:\n${result}`;
            } else {
                const result = runBF(utob(source));
                textarea[1].value = `output:\n${result.output.join('')}\n\nmemories:\n${result.memories}`;
            }
        });

        document.body.addEventListener('keydown', event => {
            if (event.keyCode === 16) {
                button.innerText = 'Unchi-Lang に変換';
                button.style.background = '#fc496d';
                flag = true;
            }
        });

        document.body.addEventListener('keyup', event => {
            if (event.keyCode === 16) {
                button.innerText = 'Unchi-Lang を実行';
                button.style.background = '#0ac9b6';
                flag = false;
            }
        });
    };
})();
