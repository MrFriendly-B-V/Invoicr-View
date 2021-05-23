export interface IConfig {
    host:   string
}

export async function loadConfig(): Promise<IConfig> {
    let config = <IConfig> await $.ajax({
        method: "GET",
        url: "/dist/config.json"
    });

    return config;
}