import type { Lesson, LessonStep } from "@/types";
import { dailyListening } from "./daily-listening";

export type LearningTrack = "study" | "career" | "daily" | "general";
export const learningGoals = [
  "Kuliah di Jerman",
  "Karier & Ausbildung",
  "Travel & keseharian",
  "Belajar hal baru",
] as const;

export function learningTrack(goal: string): LearningTrack {
  if (/kuliah|studi|beasiswa/i.test(goal)) return "study";
  if (/karier|kerja|ausbildung/i.test(goal)) return "career";
  if (/travel|perjalanan|keseharian/i.test(goal)) return "daily";
  return "general";
}
export const trackNames: Record<LearningTrack, string> = {
  study: "Kuliah di Jerman",
  career: "Karier & Ausbildung",
  daily: "Travel & keseharian",
  general: "Belajar hal baru",
};

interface Mission {
  outcome: string;
  lesson: string;
  task: string;
  examples: [string, string, string];
  meanings: [string, string, string];
  criteria: string[];
  transfer: string;
}

// A1 foundation: 30 communicative outcomes, each with three authored applications.
// These are internal course objectives, not a certification or a CEFR equivalence.
const missionPlan: Mission[] = [
  {
    outcome: "Meminta pengulangan ketika belum memahami ucapan.",
    lesson: "Wie bitte? = Bisa diulangi? Bitte langsam. = Tolong pelan-pelan. Belajar dua ungkapan utuh ini lebih dahulu; kamu boleh meminta bantuan saat belum paham.",
    task: "Kamu belum menangkap ucapan lawan bicara. Tulis dua ungkapan pendek: minta diulang, lalu minta bicara pelan.",
    examples: ["Wie bitte? Bitte langsam.", "Wie bitte? Bitte langsam.", "Wie bitte? Bitte langsam."],
    meanings: ["Bisa diulangi? Tolong pelan-pelan.", "Bisa diulangi? Tolong pelan-pelan.", "Bisa diulangi? Tolong pelan-pelan."],
    criteria: ["Meminta ucapan diulang.", "Meminta bicara pelan dengan sopan."],
    transfer: "Bayangkan kamu tidak memahami nomor ruangan. Minta pengulangan tanpa melihat contoh.",
  },
  {
    outcome: "Membuka perkenalan dengan nama sendiri dan sapaan yang sesuai.",
    lesson: "Hallo cocok untuk teman; Guten Tag netral dan sopan. Ich heiße ... menyatakan nama. Und du? untuk teman, Und Sie? untuk sapaan formal.",
    task: "Sapa orang yang baru kamu temui, sebut nama sendiri, lalu tanyakan namanya. Pilih du atau Sie secara konsisten.",
    examples: ["Hallo! Ich heiße Rani. Und du?", "Guten Tag! Ich heiße Rani. Und Sie?", "Hallo! Ich heiße Rani. Und du?"],
    meanings: ["Halo! Nama saya Rani. Kalau kamu?", "Selamat siang! Nama saya Rani. Kalau Anda?", "Halo! Nama saya Rani. Kalau kamu?"],
    criteria: ["Ada sapaan.", "Menyebut nama dengan bentuk kata kerja yang sesuai.", "Menanyakan nama lawan bicara."],
    transfer: "Perkenalkan seorang teman dengan namanya: Das ist ... Lalu perkenalkan dirimu sendiri.",
  },
  {
    outcome: "Menyampaikan identitas dan kondisi diri dalam dua kalimat.",
    lesson: "Ich bin ... = Saya ...; ich bin müde = saya lelah; ich bin neu hier = saya baru di sini. Kata profesi biasanya tanpa ein/eine setelah sein.",
    task: "Tulis dua kalimat tentang dirimu: status/identitas, lalu kondisi saat ini. Kamu boleh memakai situasi rekaan.",
    examples: ["Ich bin Studentin. Ich bin müde.", "Ich bin neu hier. Ich bin müde.", "Ich bin Tourist. Ich bin müde."],
    meanings: ["Saya mahasiswi. Saya lelah.", "Saya baru di sini. Saya lelah.", "Saya wisatawan. Saya lelah."],
    criteria: ["Menyatakan identitas atau status.", "Menyatakan kondisi diri dengan ich bin."],
    transfer: "Jawab pertanyaan Bist du müde? dengan kondisi yang berbeda dari contoh.",
  },
  {
    outcome: "Membedakan asal dan tempat tinggal ketika berkenalan.",
    lesson: "Ich komme aus Indonesien menyatakan asal. Ich wohne in Berlin menyatakan tempat tinggal sekarang. Woher kommst du? menanyakan asal; Wo wohnst du? menanyakan tempat tinggal.",
    task: "Sebut negara asal dan kota tempat tinggalmu dalam dua kalimat. Lalu tanyakan tempat tinggal lawan bicara.",
    examples: ["Ich komme aus Indonesien. Ich wohne in Bonn. Wo wohnst du?", "Ich komme aus Indonesien. Ich wohne in Essen. Wo wohnen Sie?", "Ich komme aus Indonesien. Ich wohne in Jakarta. Wo wohnst du?"],
    meanings: ["Saya dari Indonesia. Saya tinggal di Bonn. Kamu tinggal di mana?", "Saya dari Indonesia. Saya tinggal di Essen. Anda tinggal di mana?", "Saya dari Indonesia. Saya tinggal di Jakarta. Kamu tinggal di mana?"],
    criteria: ["Menyebut asal dengan kommen aus.", "Menyebut tempat tinggal dengan wohnen in.", "Menanyakan tempat tinggal."],
    transfer: "Temanmu mengira kamu tinggal di negara asal. Jelaskan bahwa asal dan tempat tinggalmu berbeda.",
  },
  {
    outcome: "Menggunakan angka untuk memastikan nomor yang penting.",
    lesson: "die Nummer = nomor; Ist das ...? = Apakah itu ...? 24 = vierundzwanzig, 42 = zweiundvierzig. Puluhan bulat seperti vierzig tidak memakai und. Ulangi nomor untuk memastikan informasi.",
    task: "Kamu mendengar nomor 24. Tulis pertanyaan untuk memastikan nomor tersebut, dengan angkanya ditulis sebagai kata Jerman.",
    examples: ["Ist das die Nummer vierundzwanzig?", "Ist das die Nummer vierundzwanzig?", "Ist das die Nummer vierundzwanzig?"],
    meanings: ["Apakah itu nomor 24?", "Apakah itu nomor 24?", "Apakah itu nomor 24?"],
    criteria: ["Memastikan nomor 24.", "Menulis vierundzwanzig dengan benar."],
    transfer: "Sekarang nomor yang perlu dipastikan adalah 42. Tanyakan lagi tanpa menyalin angka sebelumnya.",
  },
  {
    outcome: "Mengisi informasi umur dan pekerjaan/status dengan kalimat sederhana.",
    lesson: "Ich bin ... Jahre alt menyebut umur. Ich studiere = saya kuliah; ich arbeite = saya bekerja; ich bin Student/Studentin = saya mahasiswa/mahasiswi.",
    task: "Tulis umur dan pekerjaan atau statusmu dalam dua kalimat. Gunakan data rekaan bila tidak ingin membagikan data pribadi.",
    examples: ["Ich bin zwanzig Jahre alt. Ich studiere.", "Ich bin dreiundzwanzig Jahre alt. Ich arbeite.", "Ich bin dreißig Jahre alt. Ich bin Lehrer."],
    meanings: ["Saya 20 tahun. Saya kuliah.", "Saya 23 tahun. Saya bekerja.", "Saya 30 tahun. Saya guru."],
    criteria: ["Menyatakan umur dengan Jahre alt.", "Menyampaikan pekerjaan atau status."],
    transfer: "Perkenalkan seseorang yang usianya berbeda dengan Er ist ... atau Sie ist ...",
  },
  {
    outcome: "Menggabungkan perkenalan dan pertanyaan tanpa menyalin dialog.",
    lesson: "Gabungkan pola minggu ini: Ich heiße ... / Ich komme aus ... / Ich wohne in ... . Setiap kalimat punya kata kerja sendiri. Akhiri dengan satu pertanyaan untuk melanjutkan percakapan.",
    task: "Buat perkenalan tiga kalimat berisi nama, asal, dan tempat tinggal, lalu ajukan satu pertanyaan. Gunakan identitas sendiri atau rekaan.",
    examples: ["Ich heiße Rani. Ich komme aus Indonesien. Ich wohne in Bonn. Woher kommst du?", "Ich heiße Budi. Ich komme aus Indonesien. Ich wohne in Essen. Wo wohnen Sie?", "Ich heiße Sari. Ich komme aus Indonesien. Ich wohne in Jakarta. Wie heißt du?"],
    meanings: ["Nama saya Rani, dari Indonesia, tinggal di Bonn. Kamu berasal dari mana?", "Nama saya Budi, dari Indonesia, tinggal di Essen. Anda tinggal di mana?", "Nama saya Sari, dari Indonesia, tinggal di Jakarta. Siapa namamu?"],
    criteria: ["Ada nama, asal, dan tempat tinggal.", "Ada satu pertanyaan yang dapat dijawab lawan bicara.", "Kata kerja sesuai subjek."],
    transfer: "Jawab tanpa menyalin: Wie heißen Sie? Woher kommen Sie? Wo wohnen Sie?",
  },
  {
    outcome: "Menceritakan satu anggota keluarga dalam percakapan ringan.",
    lesson: "mein Bruder = saudara laki-laki saya; meine Schwester = saudara perempuan saya. Untuk memperkenalkan: Das ist ... . Untuk namanya: Er heißt ... / Sie heißt ... .",
    task: "Perkenalkan satu anggota keluarga: hubungan keluarga dan namanya. Data boleh rekaan.",
    examples: ["Das ist meine Schwester. Sie heißt Dina.", "Das ist mein Bruder. Er heißt Dimas.", "Das ist meine Mutter. Sie heißt Siti."],
    meanings: ["Ini saudara perempuan saya. Namanya Dina.", "Ini saudara laki-laki saya. Namanya Dimas.", "Ini ibu saya. Namanya Siti."],
    criteria: ["Menyebut hubungan keluarga.", "Menggunakan mein/meine dan er/sie sesuai orang yang dimaksud."],
    transfer: "Perkenalkan anggota keluarga lain dengan hubungan dan nama berbeda.",
  },
  {
    outcome: "Menyebut benda yang diperlukan dengan artikel sebagai satu paket.",
    lesson: "Hafalkan artikel bersama bendanya: das Buch = buku, der Stift = pena, die Tasche = tas. Das ist ... = Ini ...; mein untuk maskulin/netral, meine untuk feminin dalam kalimat ini.",
    task: "Pilih dua benda di sekitarmu dan tulis namanya bersama artikel der/die/das. Lalu buat satu kalimat Das ist mein/meine ... .",
    examples: ["das Buch, der Stift. Das ist mein Buch.", "der Stift, die Tasche. Das ist mein Stift.", "die Tasche, das Buch. Das ist meine Tasche."],
    meanings: ["Buku, pena. Ini buku saya.", "Pena, tas. Ini pena saya.", "Tas, buku. Ini tas saya."],
    criteria: ["Dua kata benda disertai artikel yang tepat.", "Satu kalimat menunjuk kepemilikan dengan mein/meine."],
    transfer: "Tutup contoh, pilih benda ketiga, lalu sebut artikel dan kepemilikannya.",
  },
  {
    outcome: "Memperkenalkan benda yang belum diketahui lawan bicara.",
    lesson: "Das ist ein Buch / ein Stift / eine Tasche. Ein untuk maskulin/netral dan eine untuk feminin dalam kalimat Das ist ... . Artikel dihafalkan bersama kata bendanya.",
    task: "Jelaskan dua benda yang kamu bawa dengan Das ist ein/eine ... . Pilih benda yang berbeda.",
    examples: ["Das ist ein Buch. Das ist ein Stift.", "Das ist ein Stift. Das ist eine Tasche.", "Das ist eine Tasche. Das ist ein Buch."],
    meanings: ["Ini sebuah buku. Ini sebuah pena.", "Ini sebuah pena. Ini sebuah tas.", "Ini sebuah tas. Ini sebuah buku."],
    criteria: ["Menyebut dua benda berbeda.", "Memakai ein/eine sesuai gender kata benda."],
    transfer: "Seseorang menunjuk tasmu. Jawab Was ist das? dengan kalimat lengkap.",
  },
  {
    outcome: "Menyampaikan barang yang dimiliki dan dibutuhkan saat beraktivitas.",
    lesson: "Ich habe ... = Saya punya ... . Untuk objek maskulin: einen Stift; netral: ein Buch; feminin: eine Tasche. Brauchen berarti membutuhkan: Ich brauche einen Stift.",
    task: "Tulis satu barang yang kamu punya dan satu barang yang kamu butuhkan. Gunakan haben dan brauchen.",
    examples: ["Ich habe ein Buch. Ich brauche einen Stift.", "Ich habe einen Stift. Ich brauche eine Tasche.", "Ich habe eine Tasche. Ich brauche ein Buch."],
    meanings: ["Saya punya buku. Saya membutuhkan pena.", "Saya punya pena. Saya membutuhkan tas.", "Saya punya tas. Saya membutuhkan buku."],
    criteria: ["Menyatakan kepemilikan.", "Menyatakan kebutuhan.", "Artikel objek sesuai kata benda."],
    transfer: "Barang yang kamu butuhkan sekarang adalah buku. Sampaikan kebutuhan itu tanpa melihat contoh.",
  },
  {
    outcome: "Menyusun rencana singkat dengan keterangan waktu di awal.",
    lesson: "Dalam kalimat berita utama, kata kerja terkonjugasi berada pada unsur kedua: Heute lerne ich Deutsch. Heute adalah satu unsur; posisi kedua bukan selalu kata kedua.",
    task: "Tulis kegiatan hari ini dan besok. Awali satu kalimat dengan Heute dan satu dengan Morgen.",
    examples: ["Heute lerne ich Deutsch. Morgen lese ich ein Buch.", "Heute arbeite ich. Morgen lerne ich Deutsch.", "Heute lerne ich Deutsch. Morgen kaufe ich Brot."],
    meanings: ["Hari ini saya belajar Jerman. Besok saya membaca buku.", "Hari ini saya bekerja. Besok saya belajar Jerman.", "Hari ini saya belajar Jerman. Besok saya membeli roti."],
    criteria: ["Ada rencana Heute dan Morgen.", "Kata kerja terkonjugasi mendahului ich setelah keterangan waktu."],
    transfer: "Ganti awal kalimat dengan Am Montag dan ceritakan satu kegiatan.",
  },
  {
    outcome: "Menyampaikan pilihan minuman dan kebutuhan sederhana.",
    lesson: "Ich möchte ... , bitte = Saya ingin ... , tolong. Sebagai frasa siap pakai: einen Kaffee, einen Tee, ein Wasser. Ohne Zucker = tanpa gula; mit Milch = dengan susu.",
    task: "Pesan satu minuman dengan sopan dan tambahkan satu preferensi, misalnya tanpa gula atau dengan susu.",
    examples: ["Ich möchte einen Tee, bitte. Ohne Zucker.", "Ich möchte einen Kaffee, bitte. Mit Milch.", "Ich möchte ein Wasser, bitte. Ohne Eis."],
    meanings: ["Saya ingin teh, tolong. Tanpa gula.", "Saya ingin kopi, tolong. Dengan susu.", "Saya ingin air, tolong. Tanpa es."],
    criteria: ["Menyebut satu minuman.", "Menyebut satu preferensi yang masuk akal.", "Permintaan sopan dan dapat dipahami."],
    transfer: "Pilihan awalmu habis. Pesan minuman lain, tetap dengan satu preferensi.",
  },
  {
    outcome: "Memeriksa kembali informasi sebelum bertindak.",
    lesson: "Untuk memastikan: Ist das ...? / Haben Sie ...? . Entschuldigung berarti permisi. Zum Mitnehmen = untuk dibawa pulang; contoh lain boleh kamu pilih sesuai situasi.",
    task: "Tulis satu pertanyaan sopan untuk memastikan informasi tentang benda atau pesanan, lalu ucapkan terima kasih.",
    examples: ["Entschuldigung, ist das mein Buch? Danke!", "Entschuldigung, haben Sie einen Stift? Danke!", "Entschuldigung, ist das mein Kaffee? Danke!"],
    meanings: ["Permisi, apakah itu buku saya? Terima kasih!", "Permisi, apakah Anda punya pena? Terima kasih!", "Permisi, apakah itu kopi saya? Terima kasih!"],
    criteria: ["Ada pertanyaan untuk memastikan informasi.", "Ada ungkapan sopan."],
    transfer: "Kamu menerima tas yang tampaknya bukan milikmu. Tanyakan apakah itu tasmu.",
  },
  {
    outcome: "Menggunakan pola minggu kedua untuk menyelesaikan kebutuhan sederhana.",
    lesson: "Gabungkan kebutuhan dan pertanyaan: Ich brauche ... . Haben Sie ...? . Untuk pertanyaan ya/tidak, kata kerja ada di awal.",
    task: "Tulis pesan singkat: sebut satu kebutuhan dan tanyakan apakah lawan bicara punya barang itu. Tutup dengan terima kasih.",
    examples: ["Ich brauche ein Buch. Haben Sie ein Buch? Danke!", "Ich brauche einen Stift. Haben Sie einen Stift? Danke!", "Ich brauche eine Tasche. Haben Sie eine Tasche? Danke!"],
    meanings: ["Saya butuh buku. Apakah Anda punya buku? Terima kasih!", "Saya butuh pena. Apakah Anda punya pena? Terima kasih!", "Saya butuh tas. Apakah Anda punya tas? Terima kasih!"],
    criteria: ["Kebutuhan jelas.", "Pertanyaan sesuai kebutuhan.", "Artikel objek dan bentuk kata kerja tepat."],
    transfer: "Ubah barang yang diperlukan, lalu minta kepada teman dengan du.",
  },
  {
    outcome: "Menceritakan rutinitas dan menanyakan rutinitas orang lain.",
    lesson: "jeden Tag = setiap hari. Ich lerne / ich arbeite / ich kaufe. Pertanyaan untuk teman: Was machst du jeden Tag? = Apa yang kamu lakukan setiap hari?",
    task: "Tulis dua aktivitas rutinmu, lalu tanyakan rutinitas teman.",
    examples: ["Ich lerne jeden Tag Deutsch. Ich lese ein Buch. Was machst du jeden Tag?", "Ich arbeite jeden Tag. Ich lerne Deutsch. Was machst du jeden Tag?", "Ich kaufe Brot. Ich lerne jeden Tag Deutsch. Was machst du jeden Tag?"],
    meanings: ["Saya belajar Jerman setiap hari dan membaca buku. Apa rutinitasmu?", "Saya bekerja setiap hari dan belajar Jerman. Apa rutinitasmu?", "Saya membeli roti dan belajar Jerman setiap hari. Apa rutinitasmu?"],
    criteria: ["Menyebut dua kegiatan.", "Ada satu pertanyaan rutinitas.", "Konjugasi ich/du sesuai."],
    transfer: "Ceritakan rutinitas seorang teman dengan er atau sie.",
  },
  {
    outcome: "Menyampaikan tujuan perjalanan sederhana.",
    lesson: "zur Universität = ke universitas; zur Arbeit = ke tempat kerja; zum Bahnhof = ke stasiun; nach Hause = pulang. Pelajari sebagai frasa, lalu bedakan Wo? (lokasi) dan Wohin? (tujuan).",
    task: "Jawab Wohin gehst du? dengan tujuan yang sesuai kebutuhanmu, lalu sebut bahwa kamu pulang setelahnya memakai Dann gehe ich nach Hause.",
    examples: ["Ich gehe zur Universität. Dann gehe ich nach Hause.", "Ich gehe zur Arbeit. Dann gehe ich nach Hause.", "Ich gehe zum Bahnhof. Dann gehe ich nach Hause."],
    meanings: ["Saya pergi ke universitas. Lalu saya pulang.", "Saya pergi bekerja. Lalu saya pulang.", "Saya pergi ke stasiun. Lalu saya pulang."],
    criteria: ["Menyebut tujuan dengan preposisi yang sesuai.", "Menggunakan nach Hause untuk pulang."],
    transfer: "Besok tujuanmu stasiun. Jawab Wohin gehst du morgen?",
  },
  {
    outcome: "Menanyakan harga dan memahami jumlah sebelum membeli.",
    lesson: "Was kostet ...? menanyakan harga satu barang. zwei Euro fünfzig = €2,50; lima puluh di sini adalah sen. Euro tidak wajib di akhir: Das kostet zwei Euro fünfzig juga benar.",
    task: "Tanyakan harga barang, lalu tulis kalimat harga €3,50 dalam kata-kata Jerman sebagai latihan memahami jawaban.",
    examples: ["Was kostet das Buch? Das kostet drei Euro fünfzig.", "Was kostet der Stift? Das kostet drei Euro fünfzig.", "Was kostet das Brot? Das kostet drei Euro fünfzig."],
    meanings: ["Berapa harga buku itu? Harganya €3,50.", "Berapa harga pena itu? Harganya €3,50.", "Berapa harga roti itu? Harganya €3,50."],
    criteria: ["Menanyakan harga barang.", "Harga tiga euro lima puluh sen ditulis dengan benar."],
    transfer: "Harga berubah menjadi €4,20. Sampaikan harga barunya dalam kata-kata.",
  },
  {
    outcome: "Menjelaskan keinginan yang berhubungan dengan tujuan belajar.",
    lesson: "Ich möchte ... + infinitiv di akhir. studieren = kuliah, arbeiten = bekerja, reisen = bepergian. in Deutschland berarti di Jerman.",
    task: "Tulis dua keinginan: satu tentang tujuanmu di Jerman dan satu tentang belajar bahasa Jerman.",
    examples: ["Ich möchte in Deutschland studieren. Ich möchte Deutsch lernen.", "Ich möchte in Deutschland arbeiten. Ich möchte Deutsch lernen.", "Ich möchte nach Deutschland reisen. Ich möchte Deutsch lernen."],
    meanings: ["Saya ingin kuliah di Jerman dan belajar bahasa Jerman.", "Saya ingin bekerja di Jerman dan belajar bahasa Jerman.", "Saya ingin pergi ke Jerman dan belajar bahasa Jerman."],
    criteria: ["Menyampaikan dua keinginan.", "Infinitiv berada di akhir klausa setelah möchte."],
    transfer: "Tanyakan keinginan teman dengan Möchtest du ...?",
  },
  {
    outcome: "Menjelaskan keterbatasan atau menolak dengan sopan.",
    lesson: "Ich habe keine Zeit = Saya tidak punya waktu. Ich verstehe nicht = Saya tidak mengerti. Leider = sayangnya. kein/keine dapat menegasikan kata benda berartikel tak tentu atau tanpa artikel.",
    task: "Sampaikan satu keterbatasan dengan kein/keine dan satu dengan nicht. Pilih kalimat yang masuk akal untuk situasimu.",
    examples: ["Ich habe kein Buch. Ich verstehe nicht.", "Ich habe keine Zeit. Ich arbeite heute nicht.", "Ich habe kein Auto. Ich verstehe nicht."],
    meanings: ["Saya tidak punya buku. Saya tidak mengerti.", "Saya tidak punya waktu. Saya tidak bekerja hari ini.", "Saya tidak punya mobil. Saya tidak mengerti."],
    criteria: ["Ada negasi kata benda dengan kein/keine yang sesuai.", "Ada kalimat bermakna dengan nicht."],
    transfer: "Tolak ajakan karena tidak punya waktu. Tambahkan Leider agar penolakan lebih halus.",
  },
  {
    outcome: "Menggabungkan rencana dan keterbatasan dalam pesan singkat.",
    lesson: "Heute habe ich keine Zeit. Morgen möchte ich ... . Sesudah Heute/Morgen, kata kerja terkonjugasi tetap mendahului ich.",
    task: "Sebut bahwa hari ini kamu tidak punya waktu, lalu sampaikan kegiatan yang ingin kamu lakukan besok.",
    examples: ["Heute habe ich keine Zeit. Morgen möchte ich Deutsch lernen.", "Heute habe ich keine Zeit. Morgen möchte ich arbeiten.", "Heute habe ich keine Zeit. Morgen möchte ich nach Berlin fahren."],
    meanings: ["Hari ini saya tidak punya waktu. Besok saya ingin belajar Jerman.", "Hari ini saya tidak punya waktu. Besok saya ingin bekerja.", "Hari ini saya tidak punya waktu. Besok saya ingin pergi ke Berlin."],
    criteria: ["Keterbatasan hari ini jelas.", "Ada rencana besok.", "Posisi kata kerja pada kedua kalimat sesuai."],
    transfer: "Buat pesan lain: besok tidak punya waktu, tetapi hari Senin ingin belajar.",
  },
  {
    outcome: "Mendapatkan informasi waktu dan tempat dengan dua pertanyaan.",
    lesson: "Wo ist ...? = Di mana ...? Wann beginnt ...? = Kapan ... dimulai? der Kurs = kursus, die Arbeit = pekerjaan, die Reise = perjalanan. Pertanyaan harus menyebut informasi yang kamu perlukan.",
    task: "Tulis satu pertanyaan lokasi dan satu pertanyaan waktu mulai untuk kegiatan yang sesuai tujuanmu.",
    examples: ["Wo ist der Kurs? Wann beginnt der Kurs?", "Wo ist das Büro? Wann beginnt die Arbeit?", "Wo ist der Bahnhof? Wann beginnt die Reise?"],
    meanings: ["Di mana kursusnya? Kapan kursus dimulai?", "Di mana kantornya? Kapan pekerjaan dimulai?", "Di mana stasiunnya? Kapan perjalanan dimulai?"],
    criteria: ["Menanyakan lokasi dengan Wo.", "Menanyakan waktu dengan Wann.", "Kata kerja mengikuti kata tanya."],
    transfer: "Kamu mengetahui waktu tetapi belum tahu lokasinya. Tulis hanya pertanyaan yang masih diperlukan.",
  },
  {
    outcome: "Menanyakan arah dan mengonfirmasi petunjuk sederhana.",
    lesson: "Wo ist ...? menanyakan lokasi. geradeaus = lurus; links = kiri; rechts = kanan. Untuk memastikan: Geradeaus und dann links? = Lurus lalu kiri?",
    task: "Tanyakan lokasi tujuanmu dengan sopan. Orang itu menjawab lurus lalu kiri; ulangi petunjuknya sebagai pertanyaan konfirmasi.",
    examples: ["Entschuldigung, wo ist die Universität? Geradeaus und dann links?", "Entschuldigung, wo ist das Büro? Geradeaus und dann links?", "Entschuldigung, wo ist der Bahnhof? Geradeaus und dann links?"],
    meanings: ["Permisi, di mana universitasnya? Lurus lalu kiri?", "Permisi, di mana kantornya? Lurus lalu kiri?", "Permisi, di mana stasiunnya? Lurus lalu kiri?"],
    criteria: ["Menanyakan lokasi tujuan dengan sopan.", "Mengonfirmasi lurus lalu kiri, bukan kanan."],
    transfer: "Sekarang petunjuknya lurus lalu kanan. Konfirmasikan tanpa menyalin jawaban lama.",
  },
  {
    outcome: "Mengusulkan waktu pertemuan tanpa menimbulkan salah paham.",
    lesson: "Treffen wir uns ...? = Bagaimana kalau kita bertemu ...? um 15 Uhr = pukul 15.00; halb vier = 15.30 atau 03.30 sesuai konteks. Tambahkan morgen atau am Montag agar harinya jelas.",
    task: "Ajak seseorang bertemu besok pukul 15.30. Sebut tempat yang masuk akal, lalu minta konfirmasi dengan Passt das?",
    examples: ["Treffen wir uns morgen um 15:30 Uhr an der Universität? Passt das?", "Treffen wir uns morgen um 15:30 Uhr im Büro? Passt das?", "Treffen wir uns morgen um 15:30 Uhr am Bahnhof? Passt das?"],
    meanings: ["Bertemu besok pukul 15.30 di universitas? Apakah cocok?", "Bertemu besok pukul 15.30 di kantor? Apakah cocok?", "Bertemu besok pukul 15.30 di stasiun? Apakah cocok?"],
    criteria: ["Hari besok dan waktu 15.30 jelas.", "Ada tempat pertemuan.", "Meminta konfirmasi."],
    transfer: "Ubah janji menjadi hari Senin pukul 10.00 di stasiun dan minta konfirmasi.",
  },
  {
    outcome: "Memesan makanan, mengubah pilihan, dan meminta tagihan.",
    lesson: "Ich möchte ... bestellen = Saya ingin memesan ... . Haben Sie ...? = Apakah ada ...? Die Rechnung, bitte = Tolong tagihannya. eine Suppe = sup; einen Salat = salad; ein Wasser = air.",
    task: "Pesan makanan dan minuman. Lalu tulis permintaan tagihan sebagai bagian akhir percakapan.",
    examples: ["Ich möchte eine Suppe und ein Wasser, bitte. Die Rechnung, bitte.", "Ich möchte einen Salat und ein Wasser, bitte. Die Rechnung, bitte.", "Ich möchte eine Pizza und einen Tee, bitte. Die Rechnung, bitte."],
    meanings: ["Saya ingin sup dan air. Tolong tagihannya.", "Saya ingin salad dan air. Tolong tagihannya.", "Saya ingin pizza dan teh. Tolong tagihannya."],
    criteria: ["Memesan makanan dan minuman.", "Meminta tagihan dengan sopan."],
    transfer: "Makanan yang kamu pilih habis. Tanyakan apakah ada sup, lalu pesan pengganti.",
  },
  {
    outcome: "Membeli tiket dan menanyakan informasi keberangkatan.",
    lesson: "Eine Fahrkarte nach ... , bitte = satu tiket ke ... . Wann fährt der Zug ab? menanyakan waktu berangkat. Von welchem Gleis? menanyakan nomor jalur. Pelajari pertanyaan terakhir sebagai frasa utuh.",
    task: "Minta satu tiket ke kota pilihanmu, lalu tanyakan waktu keberangkatan dan jalurnya.",
    examples: ["Eine Fahrkarte nach Bonn, bitte. Wann fährt der Zug ab? Von welchem Gleis?", "Eine Fahrkarte nach Essen, bitte. Wann fährt der Zug ab? Von welchem Gleis?", "Eine Fahrkarte nach Berlin, bitte. Wann fährt der Zug ab? Von welchem Gleis?"],
    meanings: ["Satu tiket ke Bonn. Kapan keretanya berangkat? Dari jalur berapa?", "Satu tiket ke Essen. Kapan keretanya berangkat? Dari jalur berapa?", "Satu tiket ke Berlin. Kapan keretanya berangkat? Dari jalur berapa?"],
    criteria: ["Menyebut kota tujuan tiket.", "Menanyakan waktu berangkat.", "Menanyakan jalur keberangkatan."],
    transfer: "Tujuan berubah menjadi Hamburg. Pesan tiket dan tanyakan jalur, tanpa menanyakan harga.",
  },
  {
    outcome: "Menulis pesan yang cukup lengkap untuk ditindaklanjuti penerima.",
    lesson: "Pesan pendek perlu penerima, tujuan, waktu/tempat, dan penutup. Hallo ... / Treffen wir uns ...? / Passt das? / Viele Grüße. LG adalah singkatan informal Liebe Grüße.",
    task: "Tulis pesan kepada Anna: ajak bertemu besok pukul 17.00, tentukan tempat, minta konfirmasi, lalu tutup dengan salam.",
    examples: ["Hallo Anna! Treffen wir uns morgen um 17 Uhr an der Universität? Passt das? Viele Grüße, Rani", "Hallo Anna! Treffen wir uns morgen um 17 Uhr im Büro? Passt das? Viele Grüße, Budi", "Hallo Anna! Treffen wir uns morgen um 17 Uhr am Bahnhof? Passt das? Viele Grüße, Sari"],
    meanings: ["Pesan untuk Anna: bertemu besok pukul 17.00 di universitas, meminta konfirmasi, dan salam.", "Pesan untuk Anna: bertemu besok pukul 17.00 di kantor, meminta konfirmasi, dan salam.", "Pesan untuk Anna: bertemu besok pukul 17.00 di stasiun, meminta konfirmasi, dan salam."],
    criteria: ["Menyapa Anna dan menutup dengan salam.", "Mengajak bertemu besok pukul 17.00 di tempat tertentu.", "Meminta konfirmasi."],
    transfer: "Tulis kepada Budi untuk bertemu hari Senin pukul 10.00. Pilih lokasi berbeda.",
  },
  {
    outcome: "Menyelesaikan tugas gabungan tanpa bergantung pada dialog hafalan.",
    lesson: "Saat mengevaluasi diri, cek apakah orang lain tahu siapa kamu, apa yang kamu butuhkan, dan informasi apa yang harus dijawab. Kalimat pendek yang jelas sudah berguna.",
    task: "Sapa petugas, perkenalkan nama, sampaikan kebutuhan sesuai tujuanmu, lalu ajukan satu pertanyaan waktu atau tempat.",
    examples: ["Guten Tag! Ich heiße Rani. Ich möchte Deutsch lernen. Wann beginnt der Kurs?", "Guten Tag! Ich heiße Budi. Ich bin neu hier. Wo ist das Büro?", "Guten Tag! Ich heiße Sari. Ich möchte nach Berlin fahren. Wann fährt der Zug ab?"],
    meanings: ["Menyapa, memperkenalkan diri, ingin belajar Jerman, menanyakan waktu kursus.", "Menyapa, memperkenalkan diri sebagai orang baru, menanyakan kantor.", "Menyapa, memperkenalkan diri, ingin ke Berlin, menanyakan waktu kereta."],
    criteria: ["Perkenalan jelas.", "Kebutuhan sesuai situasi.", "Ada pertanyaan informasi yang relevan."],
    transfer: "Ganti petugas dengan teman sebaya. Ubah sapaan dan pertanyaan menjadi informal.",
  },
  {
    outcome: "Memperbaiki pesan yang belum cukup jelas berdasarkan kriteria.",
    lesson: "Remedial berarti mencoba kembali bagian yang belum berhasil. Periksa tiga hal: apakah kebutuhan jelas, kata kerja berada pada tempatnya, dan penerima tahu apa yang harus dijawab?",
    task: "Tulis dua kalimat yang dimulai Heute dan Morgen: kegiatan hari ini, lalu kegiatan yang ingin kamu lakukan besok. Periksa kembali posisi kata kerja sebelum mengirim.",
    examples: ["Heute lerne ich Deutsch. Morgen möchte ich ein Buch lesen.", "Heute arbeite ich. Morgen möchte ich Deutsch lernen.", "Heute kaufe ich Brot. Morgen möchte ich nach Berlin fahren."],
    meanings: ["Hari ini belajar Jerman. Besok ingin membaca buku.", "Hari ini bekerja. Besok ingin belajar Jerman.", "Hari ini membeli roti. Besok ingin ke Berlin."],
    criteria: ["Heute dan Morgen diikuti kata kerja terkonjugasi.", "Infinitiv setelah möchte berada di akhir.", "Kedua kegiatan dapat dipahami."],
    transfer: "Pilih satu kesalahan dari Error Notebook. Buat kalimat baru yang menghindari kesalahan itu, lalu jelaskan perubahanmu dalam bahasa Indonesia.",
  },
  {
    outcome: "Menyusun pesan nyata dan menentukan latihan lanjutan dari hasilnya.",
    lesson: "Selesai 30 sesi berarti selesai satu sprint latihan. Kemampuan perlu dibuktikan pada tugas baru dan dicek lagi setelah jeda. Gunakan perkenalan, kebutuhan, dan pertanyaan yang sudah dipelajari.",
    task: "Tulis pesan 4–6 kalimat untuk seseorang dalam situasi tujuan belajarmu: sapa, kenalkan diri, jelaskan kebutuhan, tanyakan waktu/tempat, dan tutup dengan salam.",
    examples: ["Guten Tag! Ich heiße Rani. Ich komme aus Indonesien. Ich möchte Deutsch lernen. Wann beginnt der Kurs? Viele Grüße, Rani", "Guten Tag! Ich heiße Budi. Ich bin neu hier. Ich möchte arbeiten. Wo ist das Büro? Viele Grüße, Budi", "Guten Tag! Ich heiße Sari. Ich komme aus Indonesien. Ich möchte nach Berlin fahren. Wann fährt der Zug ab? Viele Grüße, Sari"],
    meanings: ["Pesan untuk menanyakan kursus: identitas, kebutuhan belajar, dan waktu mulai.", "Pesan saat mulai bekerja: identitas, kebutuhan, dan lokasi kantor.", "Pesan tentang perjalanan: identitas, tujuan, dan waktu keberangkatan."],
    criteria: ["Ada sapaan, identitas, dan penutup.", "Kebutuhan sesuai tujuan belajar dan dapat dipahami.", "Pertanyaan waktu/tempat dapat ditindaklanjuti penerima.", "Kalimat utama memiliki struktur dasar yang sesuai."],
    transfer: "Seminggu lagi, tulis pesan baru dengan penerima, kebutuhan, dan pertanyaan berbeda. Bandingkan kemampuanmu tanpa melihat contoh lama.",
  },
];

// Match the existing course sequence: haben, adjectives, food, then time.
export const dailyMissions: Mission[] = missionPlan.map((m, index) => {
  if (index === 9) return missionPlan[10];
  if (index === 10) return {
    outcome: "Menjelaskan kondisi benda atau ruangan dengan sifat sederhana.",
    lesson: "Das Zimmer ist klein/groß/hell = ruangannya kecil/besar/terang. Das Buch ist neu = bukunya baru. Setelah ist, kata sifat tidak memakai akhiran deklinasi. aber = tetapi.",
    task: "Jelaskan benda atau ruangan dengan dua sifat. Tulis dua kalimat pendek atau gabungkan dengan aber.",
    examples: ["Das Zimmer ist klein, aber hell.", "Das Büro ist groß und hell.", "Das Zimmer ist klein. Das Buch ist neu."],
    meanings: ["Ruangan itu kecil tetapi terang.", "Kantor itu besar dan terang.", "Ruangan itu kecil. Buku itu baru."],
    criteria: ["Menyebut benda atau ruangan dengan jelas.", "Menyampaikan dua sifat dengan struktur yang sesuai."],
    transfer: "Jelaskan ruangan lain yang besar tetapi tidak terang. Gunakan groß dan nicht hell.",
  };
  if (index === 11) return missionPlan[12];
  if (index === 12) return {
    outcome: "Menyampaikan jadwal kegiatan pada hari tertentu.",
    lesson: "am Montag = pada hari Senin; am Dienstag = Selasa; am Freitag = Jumat. Untuk kalimat berita: Am Montag lerne ich Deutsch. Hari menjadi unsur pertama, kata kerja terkonjugasi unsur kedua.",
    task: "Tulis dua kegiatan pada dua hari berbeda: belajar Jerman pada Senin dan satu kegiatan pilihanmu pada Jumat.",
    examples: ["Am Montag lerne ich Deutsch. Am Freitag lese ich ein Buch.", "Am Montag lerne ich Deutsch. Am Freitag arbeite ich.", "Am Montag lerne ich Deutsch. Am Freitag kaufe ich Brot."],
    meanings: ["Senin belajar Jerman, Jumat membaca buku.", "Senin belajar Jerman, Jumat bekerja.", "Senin belajar Jerman, Jumat membeli roti."],
    criteria: ["Belajar Jerman dijadwalkan pada Senin.", "Ada kegiatan pada Jumat.", "Kata kerja mengikuti keterangan hari di awal kalimat."],
    transfer: "Ubah jadwal belajar menjadi Selasa dan kegiatan lainnya menjadi Senin. Tulis ulang kedua kalimat.",
  };
  return m;
});

const trackIndex: Record<LearningTrack, number> = { study: 0, career: 1, daily: 2, general: 2 };
const contexts: Record<LearningTrack, string> = {
  study: "Bayangkan kamu mengikuti kursus persiapan kuliah dan berinteraksi dengan teman atau petugas kampus. Latihan A1 ini membangun komunikasi dasar; bahasa perkuliahan memerlukan tahap lanjutan.",
  career: "Bayangkan kamu baru mengenal tempat kerja atau tempat Ausbildung. Latihan A1 ini untuk perkenalan dan kebutuhan sederhana; tugas profesional memerlukan bahasa bidang kerja dan tahap lanjutan.",
  daily: "Bayangkan kamu bepergian dan menjalani kegiatan sehari-hari di kota berbahasa Jerman: bertemu orang, berbelanja, dan menggunakan transportasi.",
  general: "Gunakan bahasa Jerman untuk mengenal orang, benda, tempat, dan kebiasaan baru. Setiap misi memberi hasil kecil yang bisa langsung kamu pakai di luar contoh.",
};

export function missionStep(day: number, goal: string, review = false): LessonStep {
  const m = dailyMissions[day - 1];
  const track = learningTrack(goal);
  return { type: "writing", title: review ? "Coba dalam situasi baru" : "Misi mandiri sesuai tujuanmu",
    prompt: review ? m.transfer : m.task, expected: review ? "" : m.examples[trackIndex[track]],
    assessment: "open", criteria: review ? ["Menjawab tugas situasi baru secara relevan dan dapat dipahami.", "Menggunakan kalimat Jerman dengan struktur dasar yang sesuai."] : m.criteria,
    missionId: `a1-${track}-${day}${review ? "-review" : ""}`,
  };
}

export function personalizeA1Lesson(base: Lesson, goal: string): Lesson {
  const m = dailyMissions[base.day - 1];
  if (!m || !base.subLevel.startsWith("A1")) return base;
  const track = learningTrack(goal);
  const i = trackIndex[track];
  const steps = base.steps.filter((s) => s.type !== "victory").map((s): LessonStep => {
    if (s.keywords?.length || /Ceritakan:|Perkenalkan dirimu|Perkenalkan diri lengkap/.test(s.prompt ?? "")) {
      return { ...s, assessment: "open", criteria: s.criteria ?? ["Memenuhi informasi yang diminta dalam tugas.", "Kalimat Jerman dapat dipahami dan memiliki struktur yang sesuai."] };
    }
    return s;
  });
  steps.push(
    { type: "story", title: `Pakai untuk ${trackNames[track].toLowerCase()}`, body: contexts[track] },
    { type: "pattern", title: "Bekal untuk misi hari ini", body: m.lesson },
    { type: "example", title: "Contoh dalam situasimu", german: m.examples[i], indonesian: m.meanings[i] },
    { type: "listening", title: "Tangkap informasi yang diperlukan", exercise: dailyListening[base.day - 1] },
    missionStep(base.day, goal),
    { type: "speaking", title: "Ceritakan dengan suaramu", assessment: "open", prompt: "Sampaikan secara lisan jawabanmu untuk situasi misi tadi, tanpa membaca contoh. Pastikan semua poin pada kriteria terdengar jelas.", expected: m.examples[i], criteria: m.criteria },
    { type: "victory", title: "Catat langkah berikutnya", body: "Sesi selesai berarti kamu sudah berlatih. Lihat hasil misi dan ulangi pada situasi baru sebelum menyimpulkan kemampuan sudah dikuasai.", achievements: [m.outcome, `Praktik berikutnya: ${m.transfer}`] },
  );
  return { ...base, estimatedMinutes: base.estimatedMinutes + 10, goal: [m.outcome, ...base.goal.slice(0, 2)], steps,
    application: { track: trackNames[track], outcome: m.outcome, task: m.task, criteria: m.criteria, fieldTask: m.transfer } };
}
