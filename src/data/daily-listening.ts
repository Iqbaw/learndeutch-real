import type { DrillExercise } from "@/types";

// Each clip carries information required by the question. The transcript is
// available only after answering; these are short A1 practice clips, not exam audio.
const clips: [string, string, [string, string, string], number, string][] = [
  ["Wie bitte? Bitte langsam.", "Apa yang dibutuhkan pembicara?", ["Berbicara lebih cepat", "Mengulang dengan pelan", "Mengakhiri percakapan"], 1, "Wie bitte? meminta pengulangan; langsam berarti pelan. Bukan cepat atau berpamitan."],
  ["Hallo! Ich heiße Nina. Und du?", "Siapa nama orang yang menyapa?", ["Nina", "Anna", "Mia"], 0, "Nama yang terdengar setelah Ich heiße adalah Nina; Anna dan Mia tidak disebut."],
  ["Ich bin Student. Ich bin müde.", "Bagaimana kondisi pembicara?", ["Baru di sini", "Lapar", "Lelah"], 2, "Müde berarti lelah. Student menjelaskan statusnya, bukan kondisinya."],
  ["Ich komme aus Indonesien. Ich wohne in Hamburg.", "Di mana pembicara tinggal sekarang?", ["Indonesia", "Hamburg", "Berlin"], 1, "Wohne in Hamburg menunjukkan tempat tinggal. Indonesien adalah asal; Berlin tidak disebut."],
  ["Nummer zweiundvierzig, bitte.", "Nomor mana yang dipanggil?", ["24", "14", "42"], 2, "Zweiundvierzig = 42. Satuan dua terdengar sebelum puluhan empat puluh."],
  ["Ich bin dreißig Jahre alt. Ich bin Lehrer.", "Berapa umur pembicara?", ["30", "13", "23"], 0, "Dreißig = 30; dreizehn = 13. Lehrer menyatakan pekerjaan."],
  ["Hallo, ich heiße Omar. Ich komme aus Ägypten. Ich wohne in Bonn.", "Informasi mana yang benar?", ["Nama Omar, tinggal di Bonn", "Nama Bonn, tinggal di Mesir", "Nama Omar, tinggal di Berlin"], 0, "Ich heiße Omar menyebut nama dan wohne in Bonn menyebut tempat tinggal. Ägypten adalah asal."],
  ["Das ist meine Schwester. Sie heißt Lina.", "Siapa Lina bagi pembicara?", ["Ibu", "Saudara perempuan", "Saudara laki-laki"], 1, "Schwester = saudara perempuan; Mutter = ibu; Bruder = saudara laki-laki."],
  ["Das Buch ist hier. Die Tasche ist dort.", "Benda apa yang ada di sini?", ["Tas", "Pena", "Buku"], 2, "Das Buch ist hier: buku ada di sini. Tas ada di sana; pena tidak disebut."],
  ["Ich habe ein Buch, aber keinen Stift.", "Apa yang tidak dimiliki pembicara?", ["Buku", "Tas", "Pena"], 2, "Keinen Stift menegasikan kepemilikan pena; ein Buch justru dimiliki."],
  ["Das Zimmer ist klein, aber hell.", "Bagaimana ruangannya?", ["Besar dan gelap", "Kecil dan terang", "Kecil dan gelap"], 1, "Klein = kecil; hell = terang. Aber menghubungkan dua sifat yang dikontraskan."],
  ["Ich möchte einen Tee ohne Zucker, bitte.", "Pesanan mana yang sesuai?", ["Teh tanpa gula", "Kopi tanpa gula", "Teh dengan gula"], 0, "Tee = teh; ohne Zucker = tanpa gula. Kopi dan tambahan gula bukan pesanan ini."],
  ["Am Dienstag lerne ich Deutsch. Am Freitag arbeite ich.", "Kapan pembicara belajar bahasa Jerman?", ["Jumat", "Senin", "Selasa"], 2, "Dienstag = Selasa. Freitag adalah jadwal bekerja, bukan belajar."],
  ["Guten Tag! Haben Sie einen Stift? Danke!", "Apa yang diminta pembicara?", ["Informasi harga", "Pena", "Tiket"], 1, "Haben Sie einen Stift? menanyakan ketersediaan pena. Harga dan tiket tidak disebut."],
  ["Ich habe kein Buch. Ich brauche ein Buch.", "Apa kebutuhan pembicara?", ["Membutuhkan buku", "Membutuhkan pena", "Sudah punya buku"], 0, "Brauche ein Buch menyatakan kebutuhan buku; kein Buch berarti belum punya buku."],
  ["Jeden Tag arbeite ich. Am Abend lerne ich Deutsch.", "Apa kegiatan pada malam hari?", ["Bekerja", "Belajar Jerman", "Membeli roti"], 1, "Am Abend lerne ich Deutsch: belajar pada malam hari. Bekerja disebut tanpa waktu malam."],
  ["Ich gehe zum Bahnhof. Dann gehe ich nach Hause.", "Ke mana pembicara pergi terlebih dahulu?", ["Rumah", "Universitas", "Stasiun"], 2, "Zum Bahnhof adalah tujuan pertama; dann nach Hause berarti pulang setelahnya."],
  ["Das Brot kostet vier Euro zwanzig.", "Berapa harga rotinya?", ["€4,20", "€4,02", "€20,40"], 0, "Vier Euro zwanzig berarti empat euro dua puluh sen, bukan dua sen."],
  ["Ich möchte in Deutschland arbeiten und Deutsch lernen.", "Apa keinginan pembicara?", ["Bekerja dan belajar Jerman", "Hanya berlibur", "Kuliah dan membeli buku"], 0, "Arbeiten = bekerja; Deutsch lernen = belajar Jerman. Studieren dan Urlaub tidak disebut."],
  ["Heute habe ich keine Zeit. Morgen habe ich Zeit.", "Kapan pembicara punya waktu?", ["Hari ini", "Besok", "Tidak pernah"], 1, "Keine Zeit berlaku hari ini. Morgen habe ich Zeit berarti punya waktu besok."],
  ["Morgen möchte ich ein Buch lesen. Heute arbeite ich.", "Apa rencana besok?", ["Bekerja", "Membeli buku", "Membaca buku"], 2, "Ein Buch lesen = membaca buku. Arbeiten adalah kegiatan hari ini; kaufen tidak disebut."],
  ["Der Kurs beginnt um neun Uhr. Er ist in Raum drei.", "Jam berapa kursus dimulai?", ["09.00", "03.00", "13.00"], 0, "Neun Uhr = pukul 9. Raum drei adalah nomor ruangan, bukan waktu."],
  ["Gehen Sie geradeaus und dann nach rechts.", "Ke arah mana harus berbelok?", ["Kiri", "Kanan", "Kembali"], 1, "Nach rechts = ke kanan setelah lurus. Links dan zurück tidak disebut."],
  ["Treffen wir uns morgen um halb vier am Bahnhof?", "Jam berapa waktu pertemuan yang diusulkan?", ["04.30", "03.00", "03.30"], 2, "Halb vier = setengah menuju empat, yakni 03.30 atau 15.30 menurut konteks. Bukan 04.30."],
  ["Wir haben keine Suppe. Möchten Sie einen Salat?", "Apa yang ditawarkan sebagai pengganti?", ["Sup", "Salad", "Pizza"], 1, "Suppe sedang tidak ada; einen Salat ditawarkan sebagai pengganti. Pizza tidak disebut."],
  ["Der Zug nach Hamburg fährt um vierzehn Uhr von Gleis sechs ab.", "Jalur mana untuk kereta ke Hamburg?", ["14", "4", "6"], 2, "Gleis sechs berarti jalur 6. Vierzehn Uhr adalah waktu berangkat, bukan jalur."],
  ["Hallo Anna! Treffen wir uns morgen um fünf Uhr im Café?", "Di mana tempat pertemuannya?", ["Kafe", "Stasiun", "Kantor"], 0, "Im Café menyatakan tempat. Morgen dan fünf Uhr menyatakan hari dan jam."],
  ["Ich bin neu hier. Wo ist das Büro?", "Informasi apa yang dicari?", ["Harga buku", "Lokasi kantor", "Waktu kereta"], 1, "Wo ist das Büro? menanyakan lokasi kantor. Tidak menanyakan harga atau keberangkatan."],
  ["Heute arbeite ich nicht. Morgen möchte ich arbeiten.", "Pernyataan mana yang sesuai?", ["Bekerja hari ini", "Tidak ingin bekerja besok", "Tidak bekerja hari ini; ingin bekerja besok"], 2, "Nicht menegasikan pekerjaan hari ini; möchte menyatakan keinginan untuk besok."],
  ["Guten Tag! Ich möchte einen Deutschkurs besuchen. Wann beginnt der Kurs?", "Apa yang ingin diketahui pembicara?", ["Waktu mulai kursus", "Harga tiket", "Nama pengajar"], 0, "Wann beginnt der Kurs? menanyakan waktu mulai, bukan harga atau nama pengajar."],
];

export const dailyListening: DrillExercise[] = clips.map(([audioText, prompt, options, correctIndex, explanation]) => ({ audioText, prompt, options, correctIndex, explanation }));
