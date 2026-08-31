export class AppLog {
    type: string = "ping";
    device_id: string = "0";
    user_id: string = "0";
    site_id: string = "0";
    lat: string = "0";
    lng: string = "0";
    login_time: string = "";
    logout_time: string = "";
    recorded_at: string = "";
    accuracy_meters: number | null = null;
    altitude_meters: number | null = null;
    altitude_accuracy_meters: number | null = null;
    speed_mps: number | null = null;
    heading_degrees: number | null = null;
    source: string = "";
    is_mocked: boolean = false;

}
