import os from "node:os";

export default class UtilityService {
  public getApiUptime() {
    return {
      uptime: process.uptime(),
      message: "OK",
      date: new Date(),
    };
  }

  public getApiStatus() {
    return {
      status: "OK",
    };
  }

  public getServerHardwareInfo() {
    return {
      uptime: os.uptime(),
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      type: os.type(),
      release: os.release(),
      totalmem: os.totalmem(),
      freemem: os.freemem(),
      cpus: os.cpus(),
      networkInterfaces: os.networkInterfaces(),
      loadavg: os.loadavg(),
      homedir: os.homedir(),
      tmpdir: os.tmpdir(),
      userInfo: os.userInfo(),
      runtime: "Node.js",
      version: process.version,
    };
  }
}
