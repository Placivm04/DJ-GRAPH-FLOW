
import { DataSource } from 'typeorm';
import { Song } from './songs/song.entity';
import { Transition } from './transitions/transition.entity';

const songsData = [
    { title: 'Goteo', artist: 'Duki', bpm: 74, musicalKey: '2A' },
    { title: 'Como Panas', artist: 'Bryant Myers', bpm: 79, musicalKey: '3A' },
    { title: 'Relacion Rota', artist: 'Myke Towers', bpm: 80, musicalKey: '11A' },
    { title: 'Do You Remember', artist: 'Xiyo, Fernandezz, Eix', bpm: 80, musicalKey: '11A' },
    { title: 'LA NOCHE DE ANOCHE', artist: 'Bad Bunny, ROSALIA', bpm: 82, musicalKey: '9A' },
    { title: 'Cuando No Era Cantante', artist: 'El Bogueto, Yung Beef', bpm: 83, musicalKey: '11A' },
    { title: 'Bandido', artist: 'Myke Towers, Junh', bpm: 84, musicalKey: '4B' },
    { title: 'Sola Remix', artist: 'Anuel AA, Daddy Yanke, Zyon & Lennox', bpm: 85, musicalKey: '1A' },
    { title: '120', artist: 'Bad Bunny', bpm: 86, musicalKey: '7A' },
    { title: '6 AM', artist: 'J Balvin, Farruko', bpm: 88, musicalKey: '4A' },
    { title: 'La Placita', artist: 'Delaossa, EAZYBOI, J.Moods', bpm: 90, musicalKey: '9A' },
    { title: 'El Telefono', artist: 'Hector El Father, Wisin & Yande', bpm: 90, musicalKey: '10A' },
    { title: 'Ganga Remix', artist: 'Bryant Myers, Anuel AA', bpm: 90, musicalKey: '11A' },
    { title: 'La Forma En Que Me Miras', artist: 'Super Yei, Myke Towers, Lenny Tavarez', bpm: 90, musicalKey: '3B' },
    { title: 'Loco', artist: 'Justin Quiles, Chimbala, Zion & Lennox', bpm: 90, musicalKey: '4B' },
    { title: 'Secreto', artist: 'Anuel AA, Karol G', bpm: 90, musicalKey: '12A' },
    { title: 'Volvera', artist: 'El Canto Del Loco', bpm: 90, musicalKey: '2B' },
    { title: 'Me Reclama', artist: 'Mambo Kingz, Ozuna', bpm: 90, musicalKey: '12A' },
    { title: 'Escapate Conmigo Remix', artist: 'Wisin, Ozuna, Bad Bunny', bpm: 92, musicalKey: '1A' },
    { title: 'Hace Mucho Tiempo', artist: 'Ele A El Domino', bpm: 92, musicalKey: '1A' },
    { title: 'No Me Conoce Remix', artist: 'Jhayco, Bad Bunny, J Balvin', bpm: 92, musicalKey: '3A' },
    { title: 'DESDE 0', artist: 'JC Reyes, Morad, Quevedo', bpm: 92, musicalKey: '12A' },
    { title: 'Girl', artist: 'Myke Towers', bpm: 93, musicalKey: '1A' },
    { title: 'Si Se Da', artist: 'Myke Towers, Farruko', bpm: 94, musicalKey: '10A' },
    { title: 'Felices los 4', artist: 'Maluma', bpm: 94, musicalKey: '7B' },
    { title: 'Fantasias', artist: 'Rauw Alejandro', bpm: 94, musicalKey: '3B' },
    { title: 'Ruina', artist: 'Xiyo, Fernandezz, Yung Beef, Quevedo', bpm: 95, musicalKey: '9A' },
    { title: 'Una en un Millon', artist: 'Alexis y Fido', bpm: 95, musicalKey: '2A' },
    { title: 'Yo y Tu', artist: 'Quevedo, Beele', bpm: 95, musicalKey: '6A' },
    { title: 'Quiere Beber', artist: 'Anuel AA', bpm: 95, musicalKey: '4B' },
    { title: 'Candy', artist: 'Plan B', bpm: 96, musicalKey: '10A' },
    { title: 'Te Pintaron Pajaritos', artist: 'Yandar & Yostin', bpm: 96, musicalKey: '11A' },
    { title: 'Duro Ma', artist: 'Saiko, Bryant Myers, Dei V', bpm: 98, musicalKey: '10A' },
    { title: 'Adictiva', artist: 'Daddy Yankee, Anuel AA', bpm: 99, musicalKey: '8A' },
    { title: 'Me Mareo', artist: 'Kidd Voodoo, JC Reyes', bpm: 100, musicalKey: '8A' },
    { title: 'Fisica o Quimica', artist: 'Despistaos', bpm: 100, musicalKey: '9B' },
    { title: 'Mala', artist: '6ix9ine, Anuel AA', bpm: 100, musicalKey: '4A' },
    { title: 'Hasta Que Se Seque El Malecon', artist: 'Jacob Forever', bpm: 100, musicalKey: '6A' },
    { title: 'Si Te Pillara', artist: 'Beele', bpm: 100, musicalKey: '7A' },
    { title: 'TOTO DE LOCA', artist: 'Metrika', bpm: 100, musicalKey: '11A' },
    { title: 'Verte Ir', artist: 'DJ Luian, Anuel AA', bpm: 104, musicalKey: '11A' },
    { title: 'Consentia', artist: 'DELLAFUENTE', bpm: 105, musicalKey: '11A' },
    { title: 'Me Rehuso', artist: 'Danny Ocean', bpm: 105, musicalKey: '3B' },
    { title: 'China', artist: 'Anuel AA, Daddy Yankee, Ozuna', bpm: 105, musicalKey: '8A' },
    { title: 'Que Tengo Que Hacer', artist: 'Daddy Yankee', bpm: 108, musicalKey: '3A' },
    { title: 'Donde Estan Las Gatas', artist: 'Alex Gargolas, Nicky Jam', bpm: 110, musicalKey: '5A' },
    { title: 'Guerrera', artist: 'DELLAFUENTE, C.Tangana', bpm: 115, musicalKey: '2B' },
    { title: 'Ayer Me Llamo Mi Ex', artist: 'KHEA, Lenny Santos', bpm: 117, musicalKey: '2A' },
    { title: 'NUEVAYol', artist: 'Bad Bunny', bpm: 118, musicalKey: '8A' },
    { title: 'CELOSA', artist: 'JC Reyes', bpm: 120, musicalKey: '7A' },
    { title: 'MOJABI_GHOST', artist: 'Bad Bunny', bpm: 122, musicalKey: '4A' },
    { title: 'La Despedida', artist: 'Daddy Yankee', bpm: 122, musicalKey: '7A' },
    { title: 'Sigue', artist: 'Beny Jr, Morad', bpm: 122, musicalKey: '11A' },
    { title: 'Limbo', artist: 'Daddy Yankee', bpm: 125, musicalKey: '9A' },
    { title: 'Se Vuelve Loca', artist: 'Juan Magan', bpm: 126, musicalKey: '2A' },
    { title: 'Tenia Tanto Que Darte', artist: 'Nena Daconte', bpm: 126, musicalKey: '2B' },
    { title: 'Gol', artist: 'Cali y El Dandee', bpm: 126, musicalKey: '3B' },
    { title: 'Mi Reina', artist: 'Henry Mendez', bpm: 128, musicalKey: '10B' },
    { title: 'Si No Te Quisiera', artist: 'Juan Magan, Belinda, Lapiz Conciente', bpm: 128, musicalKey: '5B' },
    { title: 'Rayos De Sol', artist: 'Jose De Rico, Henry Mendez', bpm: 128, musicalKey: '5A' },
    { title: 'Oye Niña', artist: 'XRIZ', bpm: 130, musicalKey: '11A' },
    { title: 'Caile', artist: 'Bad Bunny, Bryant Myers', bpm: 130, musicalKey: '12A' },
    { title: 'NINFO', artist: 'JC Reyes, De La Rose', bpm: 130, musicalKey: '6A' },
    { title: 'Toca Toca', artist: 'Fly Project', bpm: 130, musicalKey: '3A' },
    { title: 'Dime Si Te Acuerdas', artist: 'Bad Bunny', bpm: 132, musicalKey: '3A' },
    { title: 'Ni Bien Ni Mal', artist: 'Bad Bunny', bpm: 132, musicalKey: '4A' },
    { title: 'No Te Hagas', artist: 'Jory Boy, Bad Bunny', bpm: 132, musicalKey: '5A' },
    { title: 'Calenton', artist: 'Mora', bpm: 134, musicalKey: '3A' },
    { title: 'La Playa', artist: 'Myke Towers', bpm: 140, musicalKey: '6B' },
    { title: 'MODELITO', artist: 'Mora, YOVNGCHIMI', bpm: 145, musicalKey: '6A' },
    { title: 'Kemba Walker', artist: 'Eladio Carrion, Bad Bunny', bpm: 147, musicalKey: '1A' }
];

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'dj-graph.db',
    entities: [Song, Transition],
    synchronize: true,
});

async function seed() {
    try {
        await AppDataSource.initialize();
        const songRepo = AppDataSource.getRepository(Song);

        console.log(`Starting seed of ${songsData.length} songs...`);
        let addedCount = 0;
        let skippedCount = 0;

        for (const s of songsData) {
            const exists = await songRepo.findOneBy({ title: s.title, artist: s.artist });
            if (!exists) {
                await songRepo.save(s);
                addedCount++;
            } else {
                skippedCount++;
            }
        }

        console.log(`Seed complete! Added: ${addedCount}, Skipped: ${skippedCount}`);
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();
