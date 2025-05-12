const http = require("http");
const url = require("url");
const fs = require("fs");

// Definir la función palidromo antes de usarla
function palidromo(palabra) {
  const palabraFormat = palabra.toLowerCase().replace(/[^a-z]/g, '');
  const palabraPalindromo = palabraFormat.split("").reverse().join("");
  return palabraFormat === palabraPalindromo;}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const { palabra } = query;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  if (pathname === "/") {
    res.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Formulario de Palíndromo</title>
      </head>
      <body>
        <h1>Comprobar Palíndromo</h1>
        <form action="/comprobar" method="get">
          <label for="palabra">Introduce una palabra:</label>
          <input type="text" id="palabra" name="palabra" required>
          <button type="submit">Comprobar</button>
        </form>
      </body>
      </html>
    `);
    res.end();
  } else if (pathname === "/comprobar") {
    if (palabra) {
      let texto = "";
      const esPalindromo = palidromo(palabra);
      if (esPalindromo) {
        res.write(`
          <article>
            <h2>La palabra ${palabra.toUpperCase()} es un Palíndromo!</h2>
          </article>
        `);
        texto = `El usuario ha comprobado la palabra "${palabra}" y es un palindromo`;
      } else {
        res.write(`
          <article>
            <h2>La palabra ${palabra.toUpperCase()} no es un Palíndromo!</h2>
          </article>
        `);
        texto = `El usuario ha comprobado la palabra "${palabra}" y NO es un palindromo`;
      }

      try {
        fs.appendFile("./palabrasBuscadas.txt", texto + "\n", "utf8", (err) => {
          if (err) {
            console.log("Error de escritura", err);
          }
        });
      } catch (e) {
        console.log("Error al escribir en el archivo.", e);
      }
    } else {
      res.write(`
        <article>
          <h2>No hay datos para inspeccionar.</h2>
          <p>Aporta una palabra para ver si es o no un palíndromo</p>
        </article>
      `);
    }
    res.end();
  } else {
    res.statusCode = 404;
    res.write("<h1>Página no encontrada</h1>");
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Escuchando peticiones por el puerto 3000");
});
