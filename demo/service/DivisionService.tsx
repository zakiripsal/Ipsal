import { Demo } from '@/types';

export const DivisionService = {
    getDivision() {
        return fetch('/demo/data/division.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => {
                console.log('Fetched Divisions:', d.data); // Log data divisi yang diambil
                return d.data as Demo.Division[];
            });
    }
};