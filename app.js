const fs = require("fs");
const { exec } = require("child_process");

const inputFile = "rutas.txt"; // Asegúrate de que este es el camino correcto a tu archivo

fs.readFile(inputFile, "utf8", (err, data) => {
  if (err) {
    console.error("Error al leer el archivo:", err);
    return;
  }

  const files = data.split("\n");

  files.forEach((file) => {
    exec(`eslint ${file.trim()} --format json`, (err, stdout, stderr) => {
      if (err) {
        console.error(`Error al ejecutar ESLint en ${file}:`, stderr);
        return;
      }

      const results = JSON.parse(stdout);
      results.forEach((result) => {
        result.messages.forEach((msg) => {
          if (msg.ruleId === "no-unused-vars") {
            const line = msg.line;
            let content = fs.readFileSync(file, "utf8");
            let lines = content.split("\n");
            lines[line - 1] = `// ${lines[line - 1]} // gedeon ${msg.message}`;
            content = lines.join("\n");
            fs.writeFileSync(file, content, "utf8");
          }
        });
      });

      console.log(`Archivo procesado: ${file}`);
    });
  });
});
