import { Demo } from '@/types';

export const UserService = {
    getUser() {
        return fetch('/demo/data/user.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d.data as Demo.User[]);
    }


    
 };
