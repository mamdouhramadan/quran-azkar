
export const fetchPrayerTimes = async (city: string) => {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=2`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const data = await response.json();
    return data.data.timings;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    // Return mock data as fallback
    return {
      Fajr: '05:30',
      Dhuhr: '12:15',
      Asr: '15:45',
      Maghrib: '18:20',
      Isha: '19:50',
    };
  }
};
