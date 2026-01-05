import os from 'node:os';

export function getSystemSpecs() {
    const cpu = os.cpus()[0];
    const totalMemGB = (os.totalmem() / 1024 / 1024 / 1024).toFixed(0);

    return {
        model: cpu.model,
        speed: `${(cpu.speed / 1000).toFixed(2)} GHz`,
        cores: os.cpus().length,
        memory: `${totalMemGB} GB`,
        platform: `${os.platform()} ${os.release()}`,
        arch: os.arch()
    };
}

console.log("System:", getSystemSpecs());