const img = document.querySelector('img');
const canvas = document.querySelector('canvas');

async function findFaces() {
    const model = await blazeface.load();
    const predictions = await model.estimateFaces(img, false);
    const rostos_lindos = [];

    if (predictions.length > 0) {
        document.getElementById("status").innerText = "Sucesso! Encontramos rostos!";

        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');

        ctx.fillStyle = 'rgba(129, 26, 189)';

        for (let i = 0; i < predictions.length; i++) {
            const start = predictions[i].topLeft;
            const end = predictions[i].bottomRight;
            const size = [end[0] - start[0], end[1] - start[1]];

            ctx.fillRect(start[0], start[1], size[0], size[1]);

            rostos_lindos.push({
                topLeft: [start[0], start[1]],
                bottomRight: [end[0], end[1]],
            });
        }
    } else {
        document.getElementById("status").innerText = "Erro! Não conseguimos encontrar rostos!";
    }

    return rostos_lindos;
}
async function calcularDistancia() {
    const rostos_lindos = await findFaces();
    let disttrue = true;

    if (rostos_lindos.length >= 0) {
        rostos_lindos.sort((x, y) => x.topLeft[0] - y.topLeft[0]);

        for (let i = 0; i < rostos_lindos.length; i++) {
            if (i !== 0) {
                const dist = rostos_lindos[i].topLeft[0] - rostos_lindos[i - 1].bottomRight[0];
                const dist_min = dist >= 20;

                if (!dist_min) {
                    document.getElementById("status").innerText = "Alerta! Não está ocorrendo o distanciamento de 1,5 metros!";
                    disttrue = false;
                }
            }
        }

        if (disttrue) {
            document.getElementById("status").innerText = "Tudo certo!O distanciamento de 1, 5 metros está ocorrendo!";
        }
    } else {
        document.getElementById("status").innerText = "Erro! Não conseguimos encontrar rostos!";
    }
}