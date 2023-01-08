import axios, { AxiosInstance } from "axios";
// TODO: pass API key in header

/**
 * MBCloud file management library
 * @v1 : delete file completely from server and store only if force is on
 */
class MBCloud {
  protected http: AxiosInstance;
  public constructor() {
    this.http = axios.create({ baseURL: process.env.MB_CLOUD_SERVER });
  }

  public async deleteById(_id: string, force: boolean = true) {
    const api = process.env.MB_CLOUD_API ?? null;
    await this.http.delete("/file/_delete", {
      data: { _id, api, ...(force && { force }) },
    });
  }

  public async deleteByName(filename: string, force: boolean = true) {
    const api = process.env.MB_CLOUD_API ?? null;
    await this.http.delete("/file/_delete", {
      data: { filename, api, ...(force && { force }) },
    });
  }
}

export default MBCloud;
