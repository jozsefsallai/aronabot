use chrono::{DateTime, Days, NaiveTime, TimeZone, Timelike, Utc};
use chrono_tz::Asia::Tokyo;

pub const MONTHS: [&str; 12] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

/// Birthday with a 0-based month (January = 0), matching JS `Date` months.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Birthday {
    pub month: u32,
    pub day: u32,
}

pub fn parse_month(month: &str) -> Option<u32> {
    MONTHS
        .iter()
        .position(|&m| m == month)
        .map(|i| i as u32)
}

/// Parse a birthday string like `"January 15"`.
pub fn parse_birthday(birthday: &str) -> Option<Birthday> {
    let mut parts = birthday.split_whitespace();
    let month_str = parts.next()?;
    let day_str = parts.next()?;

    let month = parse_month(month_str)?;
    let day = day_str.parse::<u32>().ok()?;

    Some(Birthday { month, day })
}

/// Current instant as `DateTime<Utc>` (wall clock via Asia/Tokyo for JST helpers).
pub fn current_time_jst() -> DateTime<Utc> {
    Utc::now().with_timezone(&Tokyo).with_timezone(&Utc)
}

/// Most recent cafe reset breakpoint (04:00 or 16:00 JST), as UTC.
pub fn current_closest_breakpoint_jst() -> DateTime<Utc> {
    let now = Utc::now().with_timezone(&Tokyo);
    let hour = now.hour();
    let date = now.date_naive();

    let (bp_date, bp_hour) = if hour < 4 {
        (date - Days::new(1), 16u32)
    } else if hour < 16 {
        (date, 4u32)
    } else {
        (date, 16u32)
    };

    let naive = bp_date
        .and_time(NaiveTime::from_hms_opt(bp_hour, 0, 0).expect("valid breakpoint time"));

    Tokyo
        .from_local_datetime(&naive)
        .single()
        .expect("unique Tokyo local time")
        .with_timezone(&Utc)
}

/// Daily reset at 04:00 JST for the JST calendar day of `jst_date`.
/// If the local hour is before 04:00, uses the previous day's 04:00.
pub fn reset_time_for_date_jst(jst_date: DateTime<Utc>) -> DateTime<Utc> {
    let tokyo = jst_date.with_timezone(&Tokyo);
    let hour = tokyo.hour();
    let date = tokyo.date_naive();

    let reset_date = if hour < 4 {
        date - Days::new(1)
    } else {
        date
    };

    let naive = reset_date
        .and_time(NaiveTime::from_hms_opt(4, 0, 0).expect("valid reset time"));

    Tokyo
        .from_local_datetime(&naive)
        .single()
        .expect("unique Tokyo local time")
        .with_timezone(&Utc)
}

/// Daily reset for the current JST day.
pub fn current_reset_jst() -> DateTime<Utc> {
    reset_time_for_date_jst(current_time_jst())
}
