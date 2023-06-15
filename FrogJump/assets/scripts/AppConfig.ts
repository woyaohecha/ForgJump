export enum AdType {
    WXAD,
    LOCALAD
}

export class AppConfig {
    public static appid = "wx8557cfb2c8e8d794";
    public static secret = "b8501d108066407890ba2b5a7dbbdfa4";
    public static ad = {
        banner: "",
        video: "",
        interstitial: ""
    }
    public static adType = AdType.LOCALAD;
}

