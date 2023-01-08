import application from "./application";

const PORT = process.env.PORT;
// ((): void => {
// application!.listen(PORT, (): boolean =>
//   process.stdout.write(
//     `⚡️[Note-server]: Server is running at http://localhost:${PORT}\n`
//   )
// );
// })();

// vercel build
export default application;
