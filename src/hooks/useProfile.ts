import { TelegramProfile } from '@/utils/getSession';
import { useState, useEffect } from 'react';


export function useProfile() {
    const [userProfile, setUserProfile] = useState<{profile: TelegramProfile, isLoading: boolean}>({profile: {} as TelegramProfile, isLoading: true});
    useEffect(() => {
        loadUserProfile();
    }, []);

    const loadUserProfile = async () => {        
        try {
            const res = await fetch('/api/auth/telegram')
            const data = await res.json()
            
            if (!res.ok) {
                console.error('Error loading user profile:', data);
                return;
            }

            setUserProfile({profile: data.profile, isLoading: false});
        } catch (error) {
            console.error('Error in user profile:', error);
        }
    };

    return {
        userProfile: userProfile.profile,
        isLoading: userProfile.isLoading,
    };
}