import application from "application";
import http from "http";

const PORT = process.env.PORT;
((): void => {
  const server = http.createServer(application!);

  server.listen(PORT, (): boolean =>
    process.stdout.write(
      `⚡️[Note-server]: Server is running at http://localhost:${PORT}\n`
    )
  );
})();
