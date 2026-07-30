export class PatrolSession {
   id: string = '';
   user_id: string = '0';
   site_id: string = '0';
   zone_id: string = '0';
   started_at: string = '';
   scheduled_end_at: string = '';
   ended_at: string = '';
   is_on_patrol: boolean = false;
   last_lat: string = '0';
   last_lng: string = '0';
   last_tracked_at: string = '';
}
