import type { Lesson, LessonStep, MajorLevel } from "@/types";
import { daysForLevel } from "./levels";
import { learningTrack, trackNames, type LearningTrack } from "./daily-missions";

type AdvancedLevel = Exclude<MajorLevel, "A1">;

interface AdvancedSeed {
  body: string;
  formula: string;
  example: string;
  meaning: string;
  wrong: string;
  correct: string;
}

const s = (
  body: string,
  formula: string,
  example: string,
  meaning: string,
  wrong: string,
  correct: string
): AdvancedSeed => ({ body, formula, example, meaning, wrong, correct });

// Teaching days. The remaining seven days in each sprint are authored
// checkpoints assembled from the units that precede them.
const TEACHING_DAYS = [1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27] as const;

const a2Units: AdvancedSeed[] = [
  s(
    "Hubungkan kemampuan A1 dengan cerita sederhana: gunakan Präsens untuk keadaan sekarang dan Perfekt untuk kejadian yang sudah selesai.",
    "sekarang → Präsens · kemarin/sudah selesai → haben/sein + Partizip II",
    "Heute arbeite ich, aber gestern habe ich Deutsch gelernt.",
    "Hari ini saya bekerja, tetapi kemarin saya belajar bahasa Jerman.",
    "Gestern ich habe Deutsch gelernt.",
    "Gestern habe ich Deutsch gelernt."
  ),
  s(
    "Sebagian besar verba membentuk Perfekt dengan haben. Kata bantu terkonjugasi berada di posisi kedua; Partizip II menutup kalimat.",
    "Subjekt + haben (Pos.2) + informasi + Partizip II",
    "Ich habe gestern lange gearbeitet.",
    "Saya bekerja lama kemarin.",
    "Ich habe gearbeitet gestern lange.",
    "Ich habe gestern lange gearbeitet."
  ),
  s(
    "Verba perpindahan tempat atau perubahan keadaan tertentu memakai sein dalam Perfekt, misalnya gehen, fahren, kommen, werden, dan bleiben sebagai pengecualian yang juga memakai sein.",
    "Subjekt + sein (Pos.2) + tujuan/waktu + Partizip II",
    "Am Samstag bin ich nach Köln gefahren.",
    "Pada hari Sabtu saya pergi ke Köln dengan kendaraan.",
    "Am Samstag habe ich nach Köln gefahren.",
    "Am Samstag bin ich nach Köln gefahren."
  ),
  s(
    "Verba beraturan biasanya memakai ge- + akar + -t. Verba berawalan tak terpisah seperti be-, ver-, er-, ent-, dan zer- tidak memakai ge-.",
    "lernen → gelernt · arbeiten → gearbeitet · besuchen → besucht",
    "Ich habe am Vormittag gearbeitet und später meine Freundin besucht.",
    "Saya bekerja pada pagi hari dan kemudian mengunjungi teman perempuan saya.",
    "Ich habe meine Freundin gebesucht.",
    "Ich habe meine Freundin besucht."
  ),
  s(
    "Dalam kalimat utama, awalan verba terpisah bergerak ke akhir. Dalam Perfekt, ge berada di antara awalan dan akar.",
    "aufstehen → ich stehe ... auf · einkaufen → ich habe eingekauft",
    "Ich stehe um sechs Uhr auf und kaufe nach der Arbeit ein.",
    "Saya bangun pukul enam dan berbelanja setelah bekerja.",
    "Ich aufstehe um sechs Uhr.",
    "Ich stehe um sechs Uhr auf."
  ),
  s(
    "Keterangan urutan membantu cerita mudah diikuti. Jika zuerst, dann, atau danach berada di awal, verba terkonjugasi tetap langsung mengikutinya.",
    "Zuerst + Verb + Subjekt · Dann + Verb + Subjekt · Danach + Verb + Subjekt",
    "Zuerst frühstücke ich, dann fahre ich zur Arbeit, danach kaufe ich ein.",
    "Pertama saya sarapan, lalu pergi bekerja, setelah itu berbelanja.",
    "Danach ich kaufe ein.",
    "Danach kaufe ich ein."
  ),
  s(
    "Gunakan um untuk jam, am untuk hari atau bagian hari tertentu, dan im untuk bulan atau musim.",
    "um + Uhrzeit · am + Tag/Tageszeit · im + Monat/Jahreszeit",
    "Der Kurs beginnt am Montag um neun Uhr und endet im Juni.",
    "Kursus dimulai hari Senin pukul sembilan dan berakhir pada bulan Juni.",
    "Der Kurs beginnt in Montag an neun Uhr.",
    "Der Kurs beginnt am Montag um neun Uhr."
  ),
  s(
    "Untuk menjawab wo?, preposisi tempat dua-arah memakai Dativ. Bentuk artikel berubah, misalnya der/das menjadi dem dan die menjadi der.",
    "wo? → in/an/auf + Dativ",
    "Das Handy liegt auf dem Tisch neben der Lampe.",
    "Ponsel itu terletak di atas meja di sebelah lampu.",
    "Das Handy liegt auf den Tisch.",
    "Das Handy liegt auf dem Tisch."
  ),
  s(
    "Dativ menandai penerima atau pihak yang terkena secara tidak langsung. Artikel dan pronomina berubah sesuai kasus.",
    "der → dem · die → der · das → dem · ich → mir · du → dir",
    "Kannst du mir bitte den Schlüssel geben?",
    "Bisakah kamu memberikan kunci itu kepada saya?",
    "Kannst du ich den Schlüssel geben?",
    "Kannst du mir den Schlüssel geben?"
  ),
  s(
    "Beberapa verba selalu meminta objek Dativ, antara lain helfen, gefallen, gehören, danken, dan antworten.",
    "helfen/gefallen/gehören/danken/antworten + Dativ",
    "Die Wohnung gefällt mir, aber der Balkon gehört meinem Nachbarn.",
    "Saya menyukai apartemen itu, tetapi balkonnya milik tetangga saya.",
    "Die Wohnung gefällt mich.",
    "Die Wohnung gefällt mir."
  ),
  s(
    "Saat berbelanja, sebut benda, ukuran atau jumlah, lalu minta harga atau ukuran lain dengan sopan.",
    "Ich hätte gern + benda · Haben Sie ... in Größe ...? · Wie viel kostet ...?",
    "Ich hätte gern diese Jacke in Größe M. Wie viel kostet sie?",
    "Saya ingin jaket ini dalam ukuran M. Berapa harganya?",
    "Ich hätte gern diese Jacke auf Größe M.",
    "Ich hätte gern diese Jacke in Größe M."
  ),
  s(
    "Petunjuk arah yang berguna menyebut tindakan dan titik acuan: geradeaus gehen, abbiegen, umsteigen, dan an der Haltestelle aussteigen.",
    "Gehen/Fahren Sie + arah · dann + Verb + Sie · an + Dativ",
    "Fahren Sie zwei Stationen und steigen Sie am Rathaus in die U-Bahn um.",
    "Naiklah dua halte lalu pindah ke kereta bawah tanah di balai kota.",
    "Steigen Sie am Rathaus auf die U-Bahn um.",
    "Steigen Sie am Rathaus in die U-Bahn um."
  ),
  s(
    "Komparatif biasanya dibentuk dengan -er dan dibandingkan memakai als. Beberapa bentuk berubah, misalnya gut menjadi besser.",
    "Adjektiv + -er + als · gut → besser · gern → lieber",
    "Der Zug ist schneller als der Bus, aber das Fahrrad ist günstiger.",
    "Kereta lebih cepat daripada bus, tetapi sepeda lebih murah.",
    "Der Zug ist mehr schnell als der Bus.",
    "Der Zug ist schneller als der Bus."
  ),
  s(
    "Superlatif predikatif memakai am + bentuk -sten/-esten. Bentuk atributif memakai artikel dan akhiran yang sesuai.",
    "am + Adjektiv-sten · der/die/das + Adjektiv-ste",
    "Von allen Möglichkeiten ist der Zug am schnellsten.",
    "Dari semua pilihan, kereta adalah yang paling cepat.",
    "Der Zug ist am schneller.",
    "Der Zug ist am schnellsten."
  ),
  s(
    "weil memperkenalkan alasan dan mendorong verba terkonjugasi ke akhir anak kalimat.",
    "Hauptsatz, weil + Subjekt + informasi + Verb",
    "Ich bleibe heute zu Hause, weil ich Fieber habe.",
    "Saya tinggal di rumah hari ini karena saya demam.",
    "Ich bleibe zu Hause, weil ich habe Fieber.",
    "Ich bleibe zu Hause, weil ich Fieber habe."
  ),
  s(
    "dass menghubungkan pernyataan, pendapat, atau informasi yang dilaporkan. Verba anak kalimat berada di akhir.",
    "Ich denke/sage/weiß, dass + Subjekt + ... + Verb",
    "Ich glaube, dass der Kurs nächste Woche beginnt.",
    "Saya percaya bahwa kursus dimulai minggu depan.",
    "Ich glaube, dass beginnt der Kurs nächste Woche.",
    "Ich glaube, dass der Kurs nächste Woche beginnt."
  ),
  s(
    "wenn berarti jika atau ketika untuk kejadian berulang. Anak kalimat bisa berada di depan; kalimat utama lalu dimulai dengan verba.",
    "Wenn + Subjekt + ... + Verb, Verb + Subjekt + ...",
    "Wenn das Wetter gut ist, fahren wir an den See.",
    "Jika cuacanya bagus, kami pergi ke danau.",
    "Wenn das Wetter ist gut, wir fahren an den See.",
    "Wenn das Wetter gut ist, fahren wir an den See."
  ),
  s(
    "Modalverben menunjukkan kemampuan, kewajiban, atau izin. Modal terkonjugasi berada di posisi kedua dan infinitiv berada di akhir.",
    "Subjekt + Modalverb (Pos.2) + ... + Infinitiv",
    "Ich muss morgen arbeiten, aber am Abend kann ich dich besuchen.",
    "Saya harus bekerja besok, tetapi malamnya saya bisa mengunjungimu.",
    "Ich muss morgen zu arbeiten.",
    "Ich muss morgen arbeiten."
  ),
  s(
    "Untuk cerita lampau, modalverben sering memakai Präteritum: konnte, musste, durfte, wollte, sollte.",
    "können → konnte · müssen → musste · dürfen → durfte · wollen → wollte",
    "Gestern musste ich länger arbeiten und konnte nicht kommen.",
    "Kemarin saya harus bekerja lebih lama dan tidak bisa datang.",
    "Gestern habe ich länger arbeiten gemusst.",
    "Gestern musste ich länger arbeiten."
  ),
  s(
    "Wechselpräpositionen memakai Akkusativ untuk arah/perubahan posisi (wohin?) dan Dativ untuk lokasi tetap (wo?).",
    "wohin? → Akkusativ · wo? → Dativ",
    "Ich stelle die Tasche auf den Tisch; jetzt liegt sie auf dem Tisch.",
    "Saya meletakkan tas ke atas meja; sekarang tas itu terletak di atas meja.",
    "Ich stelle die Tasche auf dem Tisch.",
    "Ich stelle die Tasche auf den Tisch."
  ),
  s(
    "Di dokter, jelaskan bagian tubuh, durasi, dan tingkat keluhan. Gunakan seit dengan Dativ untuk sesuatu yang masih berlangsung.",
    "Ich habe seit + Dativ + keluhan · Mir tut/tun ... weh",
    "Seit drei Tagen habe ich Halsschmerzen und mir tut der Kopf weh.",
    "Selama tiga hari saya sakit tenggorokan dan kepala saya sakit.",
    "Seit drei Tage habe ich Halsschmerzen.",
    "Seit drei Tagen habe ich Halsschmerzen."
  ),
  s(
    "Gabungkan rencana dengan werden atau Präsens berketerangan waktu, dan ceritakan pengalaman selesai dengan Perfekt.",
    "rencana → Präsens/werden + Infinitiv · pengalaman → Perfekt",
    "Nächste Woche fahre ich ans Meer; letztes Jahr bin ich in die Berge gefahren.",
    "Minggu depan saya pergi ke laut; tahun lalu saya pergi ke pegunungan.",
    "Letztes Jahr habe ich in die Berge gefahren.",
    "Letztes Jahr bin ich in die Berge gefahren."
  ),
  s(
    "Email informal yang dapat ditindaklanjuti memiliki sapaan, alasan menulis, informasi inti, pertanyaan atau ajakan, dan penutup.",
    "Anrede · Anlass · Details · Frage/Bitte · Gruß",
    "Hallo Lea, ich kann am Freitag leider nicht kommen. Können wir uns am Samstag treffen? Liebe Grüße, Rani",
    "Halo Lea, sayangnya saya tidak bisa datang hari Jumat. Bisakah kita bertemu hari Sabtu? Salam, Rani.",
    "Hallo Lea, ich nicht kann am Freitag kommen.",
    "Hallo Lea, ich kann am Freitag nicht kommen."
  ),
];

const b1Units: AdvancedSeed[] = [
  s(
    "Cerita B1 menghubungkan peristiwa, latar, dan akibat. Gunakan penanda waktu agar pendengar memahami urutan, bukan sekadar deretan kalimat Perfekt.",
    "latar → als/damals · kejadian → Perfekt/Präteritum · akibat → deshalb/dadurch",
    "Als ich nach Berlin gezogen bin, kannte ich niemanden; deshalb habe ich einen Sprachkurs besucht.",
    "Ketika saya pindah ke Berlin, saya tidak mengenal siapa pun; karena itu saya mengikuti kursus bahasa.",
    "Als ich bin nach Berlin gezogen, kannte ich niemanden.",
    "Als ich nach Berlin gezogen bin, kannte ich niemanden."
  ),
  s(
    "sein dan haben sangat sering muncul dalam Präteritum, terutama untuk keadaan dan kepemilikan di masa lalu.",
    "sein → war/waren · haben → hatte/hatten",
    "Früher hatte ich wenig Zeit, aber meine Arbeitszeiten waren flexibler.",
    "Dulu saya punya sedikit waktu, tetapi jam kerja saya lebih fleksibel.",
    "Früher habe ich wenig Zeit gehabt, aber meine Arbeitszeiten sind flexibler gewesen.",
    "Früher hatte ich wenig Zeit, aber meine Arbeitszeiten waren flexibler."
  ),
  s(
    "Modalverben lazim memakai Präteritum dalam cerita lampau. Infinitiv tetap berada di akhir kalimat.",
    "musste/konnte/durfte/wollte/sollte + ... + Infinitiv",
    "Während des Praktikums musste ich früh anfangen, konnte aber viel lernen.",
    "Selama magang saya harus mulai pagi, tetapi bisa belajar banyak.",
    "Während des Praktikums musste ich früh angefangen.",
    "Während des Praktikums musste ich früh anfangen."
  ),
  s(
    "weil memberi alasan, dass melaporkan isi, dan wenn menyatakan syarat atau kejadian berulang. Ketiganya menempatkan verba terkonjugasi di akhir anak kalimat.",
    "weil/dass/wenn + Subjekt + informasi + Verb",
    "Ich weiß, dass der Termin später beginnt, weil die Dozentin noch unterwegs ist.",
    "Saya tahu bahwa jadwal dimulai lebih lambat karena dosennya masih dalam perjalanan.",
    "Ich weiß, dass beginnt der Termin später.",
    "Ich weiß, dass der Termin später beginnt."
  ),
  s(
    "obwohl membuka anak kalimat kontras; trotzdem adalah adverbia di kalimat utama dan diikuti verba pada posisi kedua.",
    "obwohl + ... + Verb, Hauptsatz · Hauptsatz; trotzdem + Verb + Subjekt",
    "Obwohl die Aufgabe schwierig war, habe ich sie beendet; trotzdem brauche ich noch Feedback.",
    "Walaupun tugasnya sulit, saya menyelesaikannya; meskipun demikian saya masih memerlukan masukan.",
    "Trotzdem ich brauche noch Feedback.",
    "Trotzdem brauche ich noch Feedback."
  ),
  s(
    "bevor menunjukkan kejadian lebih awal, nachdem kejadian yang sudah mendahului, dan während dua kegiatan yang berlangsung bersamaan.",
    "bevor/nachdem/während + Subjekt + informasi + Verb",
    "Nachdem ich den Bericht gelesen hatte, schrieb ich eine kurze Zusammenfassung.",
    "Setelah membaca laporan tersebut, saya menulis ringkasan singkat.",
    "Nachdem ich hatte den Bericht gelesen, schrieb ich eine Zusammenfassung.",
    "Nachdem ich den Bericht gelesen hatte, schrieb ich eine Zusammenfassung."
  ),
  s(
    "Akhiran adjektiva bergantung pada artikel, kasus, dan genus. Setelah artikel tentu, akhiran yang sering muncul pada Nominativ/Akkusativ adalah -e atau -en.",
    "der neue Kurs · die neue Stelle · das neue Projekt · den neuen Kurs",
    "Ich besuche den neuen Kurs und kenne schon die freundliche Lehrerin.",
    "Saya mengikuti kursus baru itu dan sudah mengenal guru yang ramah tersebut.",
    "Ich besuche der neue Kurs.",
    "Ich besuche den neuen Kurs."
  ),
  s(
    "Dalam Dativ, adjektiva setelah artikel biasanya berakhiran -en; artikel juga berubah menjadi dem, der, atau den.",
    "mit dem neuen Kollegen · bei der internationalen Firma · mit den neuen Geräten",
    "Ich arbeite mit einer erfahrenen Kollegin an einem wichtigen Projekt.",
    "Saya bekerja bersama kolega perempuan yang berpengalaman pada sebuah proyek penting.",
    "Ich arbeite mit eine erfahrene Kollegin.",
    "Ich arbeite mit einer erfahrenen Kollegin."
  ),
  s(
    "Relativsatz menambahkan informasi tentang nomina. Pronomina relatif mengikuti genus nomina acuan dan kasusnya di dalam anak kalimat.",
    "Nomen, der/die/das + ... + Verb",
    "Der Mann, der neben mir wohnt, arbeitet an der Universität.",
    "Pria yang tinggal di sebelah saya bekerja di universitas.",
    "Der Mann, die neben mir wohnt, arbeitet an der Universität.",
    "Der Mann, der neben mir wohnt, arbeitet an der Universität."
  ),
  s(
    "Kasus pronomina relatif ditentukan oleh fungsinya di dalam Relativsatz: den untuk objek Akkusativ maskulin, dem/der untuk Dativ.",
    "Akk: den/die/das · Dat: dem/der/dem/denen",
    "Die Kollegin, der ich geholfen habe, hat sich später bedankt.",
    "Kolega perempuan yang saya bantu kemudian mengucapkan terima kasih.",
    "Die Kollegin, die ich geholfen habe, hat sich bedankt.",
    "Die Kollegin, der ich geholfen habe, hat sich bedankt."
  ),
  s(
    "Vorgangspassiv menyoroti proses atau tindakan. Pelaku boleh ditambahkan dengan von + Dativ jika relevan.",
    "werden + Partizip II · von + Dativ",
    "Die Bewerbungen werden bis Freitag von der Personalabteilung geprüft.",
    "Lamaran-lamaran diperiksa oleh bagian personalia sampai hari Jumat.",
    "Die Bewerbungen sind bis Freitag geprüft.",
    "Die Bewerbungen werden bis Freitag geprüft."
  ),
  s(
    "werden + Partizip II menyoroti proses; sein + Partizip II menyoroti keadaan hasil setelah proses selesai.",
    "Vorgang: Die Tür wird geöffnet. · Zustand: Die Tür ist geöffnet.",
    "Der Raum wird gerade vorbereitet; um neun Uhr ist er vollständig vorbereitet.",
    "Ruangan sedang dipersiapkan; pukul sembilan persiapannya sudah selesai.",
    "Der Raum ist gerade vorbereitet, jemand arbeitet noch daran.",
    "Der Raum wird gerade vorbereitet, jemand arbeitet noch daran."
  ),
  s(
    "Opini yang baik membedakan pendapat, alasan, dan batasnya. Redemittel membantu terdengar jelas tanpa mengklaim berlebihan.",
    "Meiner Meinung nach ... · Ich halte ... für ... · Allerdings ...",
    "Meiner Meinung nach ist Homeoffice sinnvoll, allerdings eignet es sich nicht für jede Tätigkeit.",
    "Menurut saya kerja dari rumah bermanfaat, tetapi tidak cocok untuk setiap jenis pekerjaan.",
    "Nach meiner Meinung Homeoffice ist sinnvoll.",
    "Meiner Meinung nach ist Homeoffice sinnvoll."
  ),
  s(
    "Susun argumen dengan pembuka, tambahan, contoh, lalu kesimpulan. Setiap konektor harus benar-benar mencerminkan hubungan antaride.",
    "zunächst → außerdem → zum Beispiel → schließlich",
    "Zunächst spart das Modell Zeit; außerdem senkt es Kosten. Schließlich profitieren beide Seiten.",
    "Pertama model itu menghemat waktu; selain itu menurunkan biaya. Pada akhirnya kedua pihak mendapat manfaat.",
    "Außerdem das Modell senkt Kosten.",
    "Außerdem senkt das Modell Kosten."
  ),
  s(
    "würde + Infinitiv menyatakan situasi hipotesis atau saran dengan bentuk yang mudah digunakan untuk banyak verba.",
    "würde (Pos.2) + ... + Infinitiv am Ende",
    "Wenn ich mehr Zeit hätte, würde ich regelmäßig an einem Sprachcafé teilnehmen.",
    "Jika saya punya lebih banyak waktu, saya akan rutin mengikuti kafe bahasa.",
    "Wenn ich mehr Zeit würde haben, nehme ich teil.",
    "Wenn ich mehr Zeit hätte, würde ich teilnehmen."
  ),
  s(
    "wäre, hätte, dan könnte adalah bentuk Konjunktiv II yang umum untuk keinginan, saran, dan kemungkinan yang tidak pasti.",
    "sein → wäre · haben → hätte · können → könnte",
    "Es wäre hilfreich, wenn wir einen ruhigeren Raum hätten.",
    "Akan membantu jika kami memiliki ruangan yang lebih tenang.",
    "Es würde hilfreich sein, wenn wir haben einen ruhigeren Raum.",
    "Es wäre hilfreich, wenn wir einen ruhigeren Raum hätten."
  ),
  s(
    "Gunakan zu + Infinitiv setelah banyak verba atau adjektiva; gunakan um ... zu untuk menyatakan tujuan ketika subjeknya sama.",
    "versuchen/planen + zu + Infinitiv · um + ... + zu + Infinitiv",
    "Ich plane, früher anzufangen, um den Bericht pünktlich abzugeben.",
    "Saya berencana mulai lebih awal agar menyerahkan laporan tepat waktu.",
    "Ich plane, früher zu anfangen, um ich den Bericht abgebe.",
    "Ich plane, früher anzufangen, um den Bericht abzugeben."
  ),
  s(
    "wegen dan trotz biasanya memakai Genitiv dalam bahasa baku. wegen menyatakan sebab, sedangkan trotz menyatakan kontras terhadap keadaan.",
    "wegen/trotz + Genitiv",
    "Wegen des starken Regens wurde die Veranstaltung abgesagt; trotz des Wetters kamen viele Gäste.",
    "Karena hujan deras acara dibatalkan; meskipun cuacanya demikian banyak tamu datang.",
    "Wegen dem starken Regen wurde die Veranstaltung abgesagt.",
    "Wegen des starken Regens wurde die Veranstaltung abgesagt."
  ),
  s(
    "Verba tertentu memiliki pasangan preposisi dan kasus tetap. Pelajari sebagai satu unit, misalnya warten auf + Akkusativ dan teilnehmen an + Dativ.",
    "warten auf + Akk · sich interessieren für + Akk · teilnehmen an + Dat",
    "Ich interessiere mich für das Seminar und nehme an der Einführung teil.",
    "Saya tertarik pada seminar itu dan mengikuti sesi pengenalannya.",
    "Ich interessiere mich an das Seminar.",
    "Ich interessiere mich für das Seminar."
  ),
  s(
    "Pertanyaan tidak langsung lebih sopan. Setelah kata pengantar, kata tanya atau ob membuka anak kalimat dan verba berada di akhir.",
    "Könnten Sie mir sagen, + W-Wort/ob + ... + Verb?",
    "Könnten Sie mir sagen, wann die Sprechstunde beginnt?",
    "Bisakah Anda memberi tahu saya kapan jam konsultasi dimulai?",
    "Könnten Sie mir sagen, wann beginnt die Sprechstunde?",
    "Könnten Sie mir sagen, wann die Sprechstunde beginnt?"
  ),
  s(
    "Keluhan formal menyebut fakta, dampak, solusi yang diharapkan, dan batas waktu yang wajar tanpa bahasa menyerang.",
    "Anrede · Sachverhalt · Auswirkung · Bitte/Lösung · Frist · Grußformel",
    "Sehr geehrte Damen und Herren, seit drei Tagen funktioniert die Heizung nicht. Ich bitte Sie um eine Reparatur bis Freitag.",
    "Yth. Bapak/Ibu, sejak tiga hari pemanas tidak berfungsi. Saya mohon perbaikan sampai Jumat.",
    "Ich will, dass Sie die Heizung sofort reparieren!",
    "Ich bitte Sie, die Heizung so bald wie möglich zu reparieren."
  ),
  s(
    "Presentasi singkat memerlukan orientasi bagi pendengar: sebut topik, urutan, contoh, dan simpulan.",
    "Thema → Gliederung → Beispiel/Beleg → Fazit",
    "Heute spreche ich über nachhaltige Mobilität. Zuerst nenne ich Vorteile, danach ein Beispiel und zum Schluss mein Fazit.",
    "Hari ini saya berbicara tentang mobilitas berkelanjutan. Pertama saya menyebut kelebihan, lalu contoh, dan terakhir kesimpulan.",
    "Heute ich spreche über nachhaltige Mobilität.",
    "Heute spreche ich über nachhaltige Mobilität."
  ),
  s(
    "Merencanakan bersama berarti mengusulkan, menanggapi, memberi alasan, dan memastikan keputusan akhir.",
    "Vorschlag → Zustimmung/Ablehnung + Grund → Alternative → Entscheidung",
    "Wir könnten uns am Samstag treffen. Vormittags kann ich nicht, aber wie wäre es um drei? Dann reserviere ich einen Tisch.",
    "Kita bisa bertemu Sabtu. Pagi saya tidak bisa, tetapi bagaimana kalau pukul tiga? Lalu saya memesan meja.",
    "Ich kann nicht. Ende.",
    "Vormittags kann ich nicht, aber wie wäre es um drei?"
  ),
];

const b2Units: AdvancedSeed[] = [
  s(
    "Pada B2, opini dikembangkan menjadi argumen: klaim harus diberi alasan, bukti atau contoh, lalu dibatasi jika datanya tidak cukup.",
    "These → Begründung → Beleg/Beispiel → Einschränkung",
    "Flexible Arbeitszeiten erhöhen oft die Zufriedenheit, weil Beschäftigte ihren Alltag besser organisieren können; das gilt jedoch nicht für jeden Beruf.",
    "Jam kerja fleksibel sering meningkatkan kepuasan karena pekerja dapat mengatur keseharian lebih baik; namun hal itu tidak berlaku untuk setiap pekerjaan.",
    "Flexible Arbeitszeiten sind immer besser, weil ich das so finde.",
    "Flexible Arbeitszeiten können Vorteile haben; das hängt jedoch vom Beruf ab."
  ),
  s(
    "einerseits ... andererseits menimbang dua sisi yang setara. Jika konektor berada di awal, verba terkonjugasi langsung mengikutinya.",
    "Einerseits + Verb + Subjekt ...; andererseits + Verb + Subjekt ...",
    "Einerseits spart die Digitalisierung Zeit, andererseits entstehen neue Sicherheitsrisiken.",
    "Di satu sisi digitalisasi menghemat waktu, di sisi lain muncul risiko keamanan baru.",
    "Einerseits die Digitalisierung spart Zeit.",
    "Einerseits spart die Digitalisierung Zeit."
  ),
  s(
    "zwar ... aber mengakui satu poin lalu membatasinya. je ... desto menunjukkan dua perubahan yang saling berkaitan.",
    "zwar + ... , aber ... · Je + Komparativ + ... + Verb, desto + Komparativ + Verb + Subjekt",
    "Zwar ist die Umstellung teuer, aber je früher wir beginnen, desto schneller profitieren wir davon.",
    "Peralihannya memang mahal, tetapi semakin cepat kami mulai, semakin cepat kami memperoleh manfaat.",
    "Je früher wir beginnen, desto wir profitieren schneller.",
    "Je früher wir beginnen, desto schneller profitieren wir."
  ),
  s(
    "Passiv dapat ditempatkan dalam berbagai kala: Präsens untuk proses sekarang, Präteritum untuk proses lampau, dan Perfekt untuk proses yang sudah selesai.",
    "wird + Partizip II · wurde + Partizip II · ist + Partizip II + worden",
    "Die Richtlinie wurde überarbeitet und ist gestern veröffentlicht worden.",
    "Pedoman tersebut direvisi dan telah dipublikasikan kemarin.",
    "Die Richtlinie ist gestern veröffentlicht geworden.",
    "Die Richtlinie ist gestern veröffentlicht worden."
  ),
  s(
    "Jika pelaku umum atau proses terdengar berat dalam pasif, gunakan man atau sich lassen untuk ungkapan yang lebih alami.",
    "Passiv → man + Aktiv · können + Passiv → sich lassen + Infinitiv",
    "Der Antrag lässt sich online ausfüllen; anschließend prüft man die Angaben automatisch.",
    "Formulir dapat diisi secara daring; setelah itu data diperiksa secara otomatis.",
    "Der Antrag lässt online ausfüllen.",
    "Der Antrag lässt sich online ausfüllen."
  ),
  s(
    "Nominalisierung memadatkan tindakan menjadi nomina dan lazim dalam teks formal. Pelaku atau objek sering dinyatakan dengan Genitiv atau von.",
    "einführen → die Einführung · prüfen → die Prüfung · entscheiden → die Entscheidung",
    "Die Einführung des Systems erfordert eine sorgfältige Prüfung der Daten.",
    "Penerapan sistem memerlukan pemeriksaan data yang cermat.",
    "Das Einführen von das System erfordert eine Prüfung.",
    "Die Einführung des Systems erfordert eine Prüfung."
  ),
  s(
    "Adjektiva dapat dinominalkan untuk menyebut kualitas atau keadaan. Pilih bentuk yang lazim, bukan sekadar menambahkan akhiran secara mekanis.",
    "möglich → die Möglichkeit · wichtig → die Wichtigkeit/Bedeutung · sicher → die Sicherheit",
    "Die Verfügbarkeit bezahlbarer Wohnungen ist für die soziale Sicherheit von großer Bedeutung.",
    "Ketersediaan hunian terjangkau sangat penting bagi keamanan sosial.",
    "Die Möglichheit einer Lösung wird geprüft.",
    "Die Möglichkeit einer Lösung wird geprüft."
  ),
  s(
    "Funktionsverbgefüge menggabungkan nomina dan verba umum dalam register formal. Pelajari sebagai kolokasi utuh.",
    "eine Entscheidung treffen · in Betracht ziehen · zur Verfügung stehen · Kritik üben an",
    "Bevor wir eine Entscheidung treffen, sollten wir weitere Alternativen in Betracht ziehen.",
    "Sebelum mengambil keputusan, kita sebaiknya mempertimbangkan alternatif lain.",
    "Wir machen eine Entscheidung.",
    "Wir treffen eine Entscheidung."
  ),
  s(
    "Konjunktiv II Vergangenheit menyatakan situasi lampau yang tidak terjadi beserta konsekuensinya.",
    "hätte + Partizip II · wäre + Partizip II · Modal: hätte + Infinitiv + Modalinfinitiv",
    "Wenn wir früher reagiert hätten, wäre der Schaden geringer gewesen.",
    "Jika kami bereaksi lebih awal, kerusakannya akan lebih kecil.",
    "Wenn wir früher reagiert würden, wäre der Schaden geringer gewesen.",
    "Wenn wir früher reagiert hätten, wäre der Schaden geringer gewesen."
  ),
  s(
    "Konjunktiv I menandai bahwa informasi berasal dari pihak lain. Bentuk ini membantu menjaga jarak terhadap klaim yang dilaporkan.",
    "Direkt: Er sagt: „Ich habe ...“ · Indirekt: Er sagt, er habe ...",
    "Die Sprecherin erklärte, das Unternehmen habe alle Vorgaben eingehalten.",
    "Juru bicara menjelaskan bahwa perusahaan telah mematuhi semua ketentuan.",
    "Die Sprecherin erklärte, das Unternehmen hat alle Vorgaben eingehalten.",
    "Die Sprecherin erklärte, das Unternehmen habe alle Vorgaben eingehalten."
  ),
  s(
    "Jika preposisi diperlukan di Relativsatz, letakkan preposisi sebelum pronomina relatif dan pilih kasus yang diminta preposisi tersebut.",
    "Nomen, Präposition + Relativpronomen + ... + Verb",
    "Das Projekt, an dem mehrere Hochschulen beteiligt sind, läuft bis Dezember.",
    "Proyek yang melibatkan beberapa perguruan tinggi berlangsung sampai Desember.",
    "Das Projekt, das mehrere Hochschulen daran beteiligt sind, läuft bis Dezember.",
    "Das Projekt, an dem mehrere Hochschulen beteiligt sind, läuft bis Dezember."
  ),
  s(
    "Partizip I menyatakan tindakan yang berlangsung; Partizip II sering menyatakan hasil atau tindakan yang telah dikenakan pada nomina.",
    "Partizip I: Verb + -d · Partizip II sebagai adjektiva + akhiran",
    "Die gestern veröffentlichte Studie untersucht den wachsenden Energiebedarf.",
    "Studi yang dipublikasikan kemarin meneliti kebutuhan energi yang meningkat.",
    "Die gestern veröffentlichen Studie untersucht den Energiebedarf.",
    "Die gestern veröffentlichte Studie untersucht den Energiebedarf."
  ),
  s(
    "Paragraf argumentatif yang kuat menyatakan tesis, memberi alasan, menyertakan bukti atau contoh, lalu menjelaskan relevansinya.",
    "These → Grund → Beleg/Beispiel → Schlussfolgerung",
    "Ein generelles Verbot wäre unverhältnismäßig. Aktuelle Daten zeigen große Unterschiede zwischen Regionen; deshalb sind gezielte Maßnahmen sinnvoller.",
    "Larangan umum akan tidak proporsional. Data terkini menunjukkan perbedaan besar antardaerah; karena itu langkah terarah lebih masuk akal.",
    "Die Daten beweisen meine Meinung, also ist jede andere Lösung falsch.",
    "Die Daten stützen diese Einschätzung, lassen aber auch andere Lösungen zu."
  ),
  s(
    "Konsesi mengakui poin lawan sebelum sanggahan. dennoch menyatakan hasil yang berlawanan dengan dugaan; hingegen membandingkan dua pihak atau keadaan.",
    "Zwar/Obwohl ...; dennoch ... · X ..., Y hingegen ...",
    "Der Vorschlag verursacht zunächst Kosten; dennoch könnte er langfristig Einsparungen ermöglichen.",
    "Usulan itu mula-mula menimbulkan biaya; meski demikian dalam jangka panjang dapat memungkinkan penghematan.",
    "Der Vorschlag verursacht Kosten; dennoch er könnte sparen.",
    "Der Vorschlag verursacht Kosten; dennoch könnte er Einsparungen ermöglichen."
  ),
  s(
    "Kohesi membuat pembaca memahami rujukan antarkalimat. Gunakan pronomina, adverbia rujukan, dan pengulangan istilah kunci secara terukur.",
    "Begriff → dieser/diese/dieses · Ursache → dadurch · Besitz/Bezug → dessen/deren",
    "Das Team führte ein neues Verfahren ein. Dadurch sank die Fehlerquote; dessen Nutzen zeigte sich besonders bei großen Datenmengen.",
    "Tim menerapkan prosedur baru. Dengan itu tingkat kesalahan turun; manfaatnya terlihat khususnya pada data dalam jumlah besar.",
    "Das Team führte ein Verfahren ein. Dadurch sie sank die Fehlerquote.",
    "Das Team führte ein Verfahren ein. Dadurch sank die Fehlerquote."
  ),
  s(
    "Register formal menghindari bahasa percakapan yang terlalu santai, tetapi tetap mengutamakan kalimat jelas daripada nominalstil berlebihan.",
    "umgangssprachlich → neutral/formell · konkret vor abstrakt · höflich vor hart",
    "Wir bitten um Rückmeldung, ob die vorgeschlagene Frist für Sie realistisch ist.",
    "Kami mohon tanggapan apakah tenggat yang diusulkan realistis bagi Anda.",
    "Sagen Sie uns mal, ob der Termin für Sie okay ist.",
    "Bitte teilen Sie uns mit, ob der Termin für Sie passend ist."
  ),
  s(
    "Laporan memisahkan fakta, interpretasi, dan rekomendasi. Email formal memerlukan tujuan yang terlihat sejak awal dan tindakan berikutnya yang jelas.",
    "Zweck → Beobachtung/Fakten → Bewertung → Empfehlung/Nächster Schritt",
    "Der Bericht fasst die Ergebnisse der Befragung zusammen. Die Beteiligung lag bei 62 Prozent; daher sollten die Aussagen vorsichtig interpretiert werden.",
    "Laporan merangkum hasil survei. Partisipasi sebesar 62 persen; karena itu pernyataannya perlu ditafsirkan dengan hati-hati.",
    "Die Umfrage war super und beweist, dass alle zufrieden sind.",
    "Die Umfrage deutet auf eine hohe Zufriedenheit hin; die begrenzte Beteiligung ist jedoch zu berücksichtigen."
  ),
  s(
    "Presentasi B2 memandu pendengar dengan signposting, transisi, dan simpulan yang kembali ke pertanyaan awal.",
    "Fragestellung → Überblick → Punkte mit Belegen → Fazit/Ausblick",
    "Zunächst kläre ich die Ausgangsfrage. Anschließend vergleiche ich zwei Ansätze, bevor ich zu einer Empfehlung komme.",
    "Pertama saya menjelaskan pertanyaan awal. Setelah itu saya membandingkan dua pendekatan sebelum sampai pada rekomendasi.",
    "Anschließend ich vergleiche zwei Ansätze.",
    "Anschließend vergleiche ich zwei Ansätze."
  ),
  s(
    "Deskripsi grafik menyebut jenis, sumber, periode, satuan, tren, dan batas interpretasi. Hindari menyatakan sebab jika grafik hanya menunjukkan hubungan.",
    "Einleitung → auffälliger Trend → Vergleich → Einschränkung",
    "Die Grafik zeigt den Anteil erneuerbarer Energien von 2020 bis 2025. Er steigt insgesamt, wobei die Daten keine Aussage über die Ursachen erlauben.",
    "Grafik menunjukkan porsi energi terbarukan dari 2020 sampai 2025. Secara keseluruhan porsinya naik, tetapi data tidak memungkinkan kesimpulan tentang penyebab.",
    "Die Grafik beweist, warum der Anteil gestiegen ist.",
    "Die Grafik zeigt einen Anstieg, erklärt jedoch nicht dessen Ursachen."
  ),
  s(
    "Sprachmittlung bukan terjemahan kata demi kata. Pilih informasi yang dibutuhkan penerima, parafrase dengan register sesuai, dan tandai ketidakpastian.",
    "Bedarf des Empfängers → Kernaussage → relevante Details → Hinweis auf Grenzen",
    "Für internationale Studierende ist vor allem wichtig, dass die Anmeldung online erfolgt und die Frist am 15. Mai endet.",
    "Bagi mahasiswa internasional, hal terpenting ialah pendaftaran dilakukan daring dan tenggat berakhir 15 Mei.",
    "Für internationale Studierende ist jedes Wort der Mitteilung gleich wichtig.",
    "Für internationale Studierende fasse ich die relevanten Anmeldeinformationen zusammen."
  ),
  s(
    "Sanggahan yang produktif merangkum argumen lawan secara adil, mengakui bagian yang kuat, lalu menunjukkan batas atau bukti tandingan.",
    "Argument fair wiedergeben → Teilzustimmung → Einwand/Beleg → Alternative",
    "Ihr Hinweis auf die Kosten ist berechtigt. Allerdings berücksichtigt die Rechnung die langfristigen Einsparungen nicht.",
    "Catatan Anda tentang biaya memang beralasan. Namun perhitungannya tidak mempertimbangkan penghematan jangka panjang.",
    "Das ist falsch, weil mein Argument besser ist.",
    "Der Einwand ist nachvollziehbar; die vorliegenden Daten sprechen jedoch für eine andere Gewichtung."
  ),
  s(
    "Inferensi membaca berasal dari pilihan kata, kontras, dan informasi yang sengaja dibatasi. Bedakan yang tertulis, yang tersirat kuat, dan yang hanya mungkin.",
    "Textbeleg → Signalwort/Ton → vorsichtige Schlussfolgerung",
    "Die Formulierung „allenfalls teilweise überzeugend“ deutet darauf hin, dass der Autor erhebliche Zweifel hat.",
    "Ungkapan 'paling-paling hanya sebagian meyakinkan' menunjukkan bahwa penulis memiliki keraguan besar.",
    "Der Autor sagt nicht alles; deshalb kann man jede Absicht annehmen.",
    "Die Wortwahl legt Zweifel nahe, beweist aber keine persönliche Absicht."
  ),
  s(
    "Kesimpulan esai menjawab kembali pertanyaan, menimbang hasil utama, dan dapat memberi implikasi; jangan memperkenalkan bukti baru.",
    "Antwort auf Fragestellung → Abwägung → Konsequenz/Ausblick",
    "Insgesamt überwiegen die Vorteile, sofern Datenschutz und Zugang gesichert sind. Entscheidend ist daher nicht das Ob, sondern die konkrete Umsetzung.",
    "Secara keseluruhan kelebihan lebih kuat selama perlindungan data dan akses terjamin. Jadi yang menentukan bukan apakah diterapkan, melainkan bagaimana pelaksanaannya.",
    "Zum Schluss möchte ich noch ein völlig neues Argument nennen.",
    "Abschließend fasse ich die abgewogenen Ergebnisse zusammen, ohne neue Belege einzuführen."
  ),
];

const c1Units: AdvancedSeed[] = [
  s(
    "C1 menuntut pilihan bahasa yang sesuai hubungan, tujuan, dan medium. Isi yang sama dapat disampaikan informal, netral, atau formal tanpa mengubah fakta.",
    "Adressat + Zweck + Medium → Registerentscheidung",
    "Könnten Sie bitte prüfen, ob eine Fristverlängerung möglich wäre?",
    "Bisakah Anda memeriksa apakah perpanjangan tenggat mungkin diberikan?",
    "Checken Sie bitte mal, ob ich später abgeben kann.",
    "Könnten Sie bitte prüfen, ob eine spätere Abgabe möglich wäre?"
  ),
  s(
    "Nachfeld memungkinkan unsur panjang, terutama dass-Satz, Infinitivsatz, atau perbandingan, diletakkan setelah kerangka verba agar kalimat lebih mudah diproses.",
    "Vorfeld · linke Klammer · Mittelfeld · rechte Klammer · Nachfeld",
    "Wir haben gestern beschlossen, die Untersuchung um zwei Wochen zu verlängern.",
    "Kemarin kami memutuskan untuk memperpanjang penelitian selama dua minggu.",
    "Wir haben, die Untersuchung um zwei Wochen zu verlängern, gestern beschlossen.",
    "Wir haben gestern beschlossen, die Untersuchung um zwei Wochen zu verlängern."
  ),
  s(
    "Konektor tingkat lanjut menandai hubungan yang lebih presisi: zumal menambah alasan kuat, wohingegen membandingkan, sofern memberi syarat terbatas.",
    "zumal + Verb am Ende · X, wohingegen Y · sofern + Bedingung",
    "Der Ansatz ist plausibel, zumal mehrere unabhängige Studien zu ähnlichen Ergebnissen kommen.",
    "Pendekatan itu masuk akal, terlebih beberapa studi independen mencapai hasil serupa.",
    "Der Ansatz ist plausibel, zumal kommen mehrere Studien zu ähnlichen Ergebnissen.",
    "Der Ansatz ist plausibel, zumal mehrere Studien zu ähnlichen Ergebnissen kommen."
  ),
  s(
    "Nominalstil memadatkan proses dan hubungan dalam teks akademik. Gunakan selektif agar aktor dan tindakan tetap terlihat.",
    "Verbalsatz → Nominalgruppe + Funktionsverb/Präposition",
    "Die Auswertung der Daten ermöglicht eine differenzierte Beurteilung der Wirksamkeit.",
    "Analisis data memungkinkan penilaian yang terdiferensiasi atas efektivitas.",
    "Das Auswerten von den Daten macht eine Beurteilung möglich.",
    "Die Auswertung der Daten ermöglicht eine Beurteilung."
  ),
  s(
    "Verbalstil sering lebih jelas daripada rangkaian nomina. Saat menyunting, kembalikan pelaku dan tindakan jika nominalisasi menyembunyikannya.",
    "Nominalisierung abbauen → Akteur + präzises Verb + Objekt",
    "Das Forschungsteam wertete die Daten aus und beurteilte anschließend die Wirksamkeit.",
    "Tim peneliti menganalisis data lalu menilai efektivitasnya.",
    "Die Durchführung der Auswertung der Daten erfolgte durch das Forschungsteam.",
    "Das Forschungsteam wertete die Daten aus."
  ),
  s(
    "Konstruksi partisipial memadatkan informasi tambahan. Acuan harus jelas dan akhiran adjektiva tetap mengikuti kasus.",
    "Relativsatz → Partizip I/II + Adjektivendung + Nomen",
    "Die unter kontrollierten Bedingungen erhobenen Daten bestätigen die ursprüngliche Annahme nur teilweise.",
    "Data yang dikumpulkan dalam kondisi terkontrol hanya mengonfirmasi sebagian asumsi awal.",
    "Die unter kontrollierten Bedingungen erhoben Daten bestätigen die Annahme.",
    "Die unter kontrollierten Bedingungen erhobenen Daten bestätigen die Annahme."
  ),
  s(
    "Konjunktiv I menandai laporan tidak langsung tanpa menjamin kebenaran isi. Gunakan sumber yang jelas dan pertahankan jarak analitis.",
    "Quelle + sagte/erklärte, + er/sie habe/sei/werde ...",
    "Die Autorin betont, ihre Analyse beruhe auf bislang unveröffentlichten Daten.",
    "Penulis menekankan bahwa analisisnya didasarkan pada data yang belum dipublikasikan.",
    "Die Autorin betont, ihre Analyse beruht auf unveröffentlichten Daten.",
    "Die Autorin betont, ihre Analyse beruhe auf unveröffentlichten Daten."
  ),
  s(
    "Jika bentuk Konjunktiv I sama dengan Indikativ, bentuk Konjunktiv II dapat menjaga penanda laporan tidak langsung, terutama pada bentuk jamak.",
    "KI uneindeutig → KII-Ersatzform · sie haben → sie hätten",
    "Die Forschenden erklärten, sie hätten sämtliche Störfaktoren berücksichtigt.",
    "Para peneliti menjelaskan bahwa mereka telah mempertimbangkan semua faktor pengganggu.",
    "Die Forschenden erklärten, sie haben sämtliche Störfaktoren berücksichtigt.",
    "Die Forschenden erklärten, sie hätten sämtliche Störfaktoren berücksichtigt."
  ),
  s(
    "Modalverben dapat menyatakan tingkat kepastian atau sumber klaim: dürfte untuk kemungkinan kuat, soll untuk informasi pihak lain, will untuk klaim diri sendiri.",
    "dürfte → wahrscheinlich · soll → laut Dritten · will → eigene Behauptung",
    "Die Maßnahme dürfte kurzfristig wirken, soll aber erhebliche Nebenwirkungen haben.",
    "Langkah itu kemungkinan efektif dalam jangka pendek, tetapi menurut kabar memiliki efek samping besar.",
    "Die Maßnahme darf kurzfristig wirken, weil sie wahrscheinlich ist.",
    "Die Maßnahme dürfte kurzfristig wirken."
  ),
  s(
    "Kolokasi dan ungkapan formal memperjelas fungsi argumen. Gunakan ungkapan yang benar-benar lazim, bukan terjemahan kata demi kata.",
    "eine Annahme infrage stellen · zu dem Schluss kommen · außer Acht lassen",
    "Die Befunde stellen die bisherige Annahme infrage, lassen jedoch regionale Unterschiede außer Acht.",
    "Temuan itu mempertanyakan asumsi sebelumnya, tetapi mengabaikan perbedaan regional.",
    "Die Befunde stellen die Annahme in Frage von ihrer Wahrheit.",
    "Die Befunde stellen die Annahme infrage."
  ),
  s(
    "Hedging menyesuaikan kekuatan klaim dengan bukti. Pilih verba dan adverbia yang menunjukkan apakah data membuktikan, mendukung, atau sekadar mengisyaratkan.",
    "belegen > stützen > darauf hindeuten > vermuten lassen",
    "Die Ergebnisse deuten darauf hin, dass der Effekt unter bestimmten Bedingungen auftreten könnte.",
    "Hasilnya mengindikasikan bahwa efek tersebut mungkin muncul dalam kondisi tertentu.",
    "Die Ergebnisse beweisen ohne Zweifel, dass der Effekt immer auftritt.",
    "Die Ergebnisse deuten darauf hin, dass der Effekt auftreten könnte."
  ),
  s(
    "Membaca kritis memisahkan fakta, evaluasi, sumber, dan strategi retoris. Sikap penulis harus ditunjukkan dengan bukti bahasa dari teks.",
    "Behauptung → sprachliches Signal → mögliche Haltung → alternative Lesart",
    "Die wiederholte Bezeichnung als „angeblich alternativlos“ signalisiert Distanz zur dargestellten Position.",
    "Penyebutan berulang sebagai 'konon tanpa alternatif' menandai jarak terhadap posisi yang disajikan.",
    "Der Autor benutzt ein negatives Wort, also hasst er die Position.",
    "Die Wortwahl signalisiert Distanz, erlaubt aber keinen sicheren Schluss auf persönliche Motive."
  ),
  s(
    "Ringkasan mempertahankan tesis, alur, dan batas argumen dengan kata sendiri. Detail dipilih berdasarkan fungsi, bukan urutan kalimat sumber.",
    "Kernaussage → zentrale Begründung → Ergebnis/Einschränkung",
    "Der Beitrag untersucht die Folgen hybrider Arbeit und kommt zu dem Schluss, dass ihre Wirkung stark von der konkreten Umsetzung abhängt.",
    "Artikel itu meneliti dampak kerja hibrida dan menyimpulkan bahwa pengaruhnya sangat bergantung pada penerapan konkret.",
    "Der Beitrag sagt zuerst ..., dann sagt er ..., danach sagt er ...",
    "Der Beitrag untersucht ..., begründet ... und kommt zu dem Schluss, dass ..."
  ),
  s(
    "Sintesis menghubungkan sumber berdasarkan kesamaan, perbedaan, metode, atau cakupan; bukan menulis dua ringkasan terpisah.",
    "gemeinsame Frage → Position A ↔ Position B → Erklärung der Differenz → Synthese",
    "Während Studie A einen kurzfristigen Effekt feststellt, findet Studie B langfristig keinen Unterschied; die abweichenden Zeiträume könnten diesen Gegensatz erklären.",
    "Sementara studi A menemukan efek jangka pendek, studi B tidak menemukan perbedaan dalam jangka panjang; perbedaan periode mungkin menjelaskan pertentangan itu.",
    "Studie A sagt X. Studie B sagt Y. Beide sind interessant.",
    "Die Studien kommen zu unterschiedlichen Ergebnissen, die sich teilweise durch ihre Zeiträume erklären lassen."
  ),
  s(
    "Esai bernuansa menimbang kondisi dan konsekuensi, bukan mencari jawaban absolut. Setiap paragraf memiliki satu fungsi dalam argumen keseluruhan.",
    "Problemrahmen → differenzierte These → Abwägung → begründetes Urteil",
    "Eine Verpflichtung kann sinnvoll sein, sofern Ausnahmen transparent geregelt und ungleiche Ausgangsbedingungen berücksichtigt werden.",
    "Sebuah kewajiban dapat masuk akal asalkan pengecualian diatur transparan dan kondisi awal yang tidak setara dipertimbangkan.",
    "Eine Verpflichtung ist entweder immer richtig oder immer falsch.",
    "Ob eine Verpflichtung sinnvoll ist, hängt von ihren Bedingungen und Folgen ab."
  ),
  s(
    "Proposal profesional menghubungkan masalah, tujuan, langkah, sumber daya, risiko, dan ukuran keberhasilan.",
    "Ausgangslage → Ziel → Maßnahmen → Ressourcen/Risiken → Erfolgskriterien",
    "Ziel des Vorschlags ist es, die Bearbeitungszeit zu verkürzen. Dazu werden zwei Abläufe gebündelt; der Erfolg wird nach drei Monaten anhand der Wartezeit geprüft.",
    "Tujuan usulan adalah mempersingkat waktu proses. Untuk itu dua alur digabung; keberhasilannya dievaluasi setelah tiga bulan berdasarkan waktu tunggu.",
    "Wir sollten etwas ändern, damit alles besser wird.",
    "Wir schlagen eine konkrete Maßnahme mit messbarem Ziel und Prüfzeitpunkt vor."
  ),
  s(
    "Presentasi C1 mengelola ekspektasi pendengar, menandai pergeseran argumen, dan membedakan hasil dari interpretasi.",
    "Leitfrage → Argumentationsweg → Befund vs Deutung → Fazit → Diskussion",
    "Damit komme ich vom empirischen Befund zu seiner Interpretation. Entscheidend ist, welche Annahmen dieser Deutung zugrunde liegen.",
    "Dengan itu saya beralih dari temuan empiris ke interpretasinya. Yang menentukan adalah asumsi apa yang mendasari interpretasi tersebut.",
    "Jetzt komme ich zu Interpretation, und die Daten bedeuten eindeutig ...",
    "Nun komme ich zur Interpretation; sie ist von den zugrunde liegenden Annahmen zu unterscheiden."
  ),
  s(
    "Persetujuan parsial menjaga diskusi produktif: akui poin yang valid, batasi cakupannya, lalu tawarkan kriteria atau alternatif.",
    "Teilzustimmung → Einschränkung → Gegenkriterium/Alternative",
    "Dem Einwand stimme ich insofern zu, als die Kosten bislang unterschätzt wurden; daraus folgt jedoch nicht, dass das Vorhaben grundsätzlich ungeeignet ist.",
    "Saya setuju dengan keberatan itu sejauh biaya selama ini diremehkan; namun itu tidak berarti proyeknya pada dasarnya tidak sesuai.",
    "Ich stimme zu, aber Sie liegen trotzdem falsch.",
    "Der Einwand ist in diesem Punkt berechtigt; die Schlussfolgerung geht jedoch zu weit."
  ),
  s(
    "Makna tersirat muncul dari ketidaksesuaian antara kata, konteks, dan pengetahuan bersama. Tafsirkan dengan bukti dan sisakan alternatif jika konteks tidak cukup.",
    "Wortlaut + Kontext + geteiltes Wissen → vorsichtige Implikatur",
    "Die Bemerkung „Das hat ja hervorragend funktioniert“ kann nach einem offensichtlichen Scheitern ironisch gemeint sein.",
    "Ucapan 'Itu benar-benar berjalan luar biasa' dapat bermakna ironis setelah kegagalan yang jelas.",
    "Der Satz ist immer ironisch, unabhängig vom Kontext.",
    "Ob der Satz ironisch ist, lässt sich nur aus Kontext und Intonation ableiten."
  ),
  s(
    "Kritik data menilai definisi, sampel, pembanding, periode, ketidakpastian, dan kemungkinan penjelasan alternatif.",
    "Fragestellung → Operationalisierung → Stichprobe → Vergleich → Unsicherheit → Schluss",
    "Der beobachtete Zusammenhang ist relevant, erlaubt wegen der selektiven Stichprobe jedoch keine Verallgemeinerung auf die Gesamtbevölkerung.",
    "Hubungan yang diamati relevan, tetapi karena sampel selektif tidak dapat digeneralisasi ke seluruh populasi.",
    "Die Zahlen sind groß, deshalb gilt das Ergebnis für alle Menschen.",
    "Die Stichprobe begrenzt, auf welche Gruppe das Ergebnis übertragen werden kann."
  ),
  s(
    "Penyuntingan gaya menghapus redundansi, memperjelas rujukan, memecah beban sintaksis, dan mengganti verba umum dengan verba yang lebih tepat.",
    "Redundanz streichen · Bezüge klären · Satzlast verteilen · präzise Verben wählen",
    "Die Analyse berücksichtigt drei Faktoren und zeigt, unter welchen Bedingungen der Effekt nachlässt.",
    "Analisis mempertimbangkan tiga faktor dan menunjukkan dalam kondisi apa efeknya melemah.",
    "Die durchgeführte Analyse nimmt eine Berücksichtigung von drei verschiedenen Faktoren vor.",
    "Die Analyse berücksichtigt drei Faktoren."
  ),
  s(
    "Mediasi lintas register mempertahankan isi dan sikap sumber sambil mengubah kepadatan, istilah, dan kesopanan untuk penerima baru.",
    "Quellintention + Kerninhalt → Bedarf und Register des Empfängers",
    "Für ein allgemeines Publikum lässt sich der Befund so zusammenfassen: Der Effekt ist erkennbar, aber noch nicht unter allen Bedingungen bestätigt.",
    "Untuk khalayak umum temuan dapat diringkas demikian: efeknya terlihat, tetapi belum terkonfirmasi pada semua kondisi.",
    "Die Studie sagt einfach, dass es funktioniert.",
    "Die Studie findet Hinweise auf einen Effekt, dessen Reichweite noch geprüft werden muss."
  ),
  s(
    "Pidato persuasif menggabungkan kredibilitas, alasan, contoh konkret, dan ajakan yang proporsional. Retorika tidak boleh menggantikan bukti.",
    "Anlass → gemeinsame Werte → begründete Position → konkreter Appell",
    "Wenn wir Teilhabe ernst nehmen, müssen wir Barrieren nicht nur benennen, sondern systematisch abbauen. Beginnen wir mit den Zugängen, die heute bereits veränderbar sind.",
    "Jika kita sungguh menganggap partisipasi penting, kita tidak hanya perlu menyebut hambatan, tetapi menguranginya secara sistematis. Mari mulai dari akses yang sudah dapat diubah hari ini.",
    "Jeder vernünftige Mensch muss meinem Vorschlag zustimmen.",
    "Ich lade Sie ein, den Vorschlag anhand transparenter Kriterien zu prüfen."
  ),
];

const c2Units: AdvancedSeed[] = [
  s(
    "Pada C2, kalimat dapat benar secara tata bahasa tetapi tetap kurang tepat karena register, konotasi, ritme, atau implikasinya. Evaluasi selalu terkait konteks.",
    "grammatisch korrekt + semantisch präzise + pragmatisch angemessen + stilistisch stimmig",
    "Der Vorschlag ist nachvollziehbar, greift in seiner jetzigen Form jedoch zu kurz.",
    "Usulan itu dapat dipahami, tetapi dalam bentuknya sekarang belum cukup menjangkau masalah.",
    "Der Vorschlag ist okay, aber irgendwie nicht genug.",
    "Der Vorschlag ist nachvollziehbar, greift jedoch zu kurz."
  ),
  s(
    "Sinonim dekat berbeda dalam kekuatan, objek lazim, dan penilaian. Pilih verba yang menyatakan hubungan persis, bukan sekadar arti kamus yang mirip.",
    "verhindern → tidak terjadi · unterbinden → menghentikan praktik · vereiteln → menggagalkan rencana",
    "Die Kontrollen sollen Missbrauch unterbinden, ohne den legitimen Zugang zu erschweren.",
    "Pemeriksaan dimaksudkan untuk menghentikan penyalahgunaan tanpa mempersulit akses yang sah.",
    "Die Kontrollen sollen den Zugang vereiteln, obwohl er legitim ist.",
    "Die Kontrollen sollen Missbrauch unterbinden, ohne legitimen Zugang zu verhindern."
  ),
  s(
    "Konotasi membawa sikap di luar makna denotatif. Uji apakah sebuah kata terdengar netral, memuji, merendahkan, teknis, atau emosional.",
    "Denotation + Konnotation + Sprecherhaltung + Kontextwirkung",
    "Die Bezeichnung „Sparprogramm“ klingt neutraler als „Kahlschlag“, obwohl beide dieselbe Maßnahme rahmen können.",
    "Sebutan 'program penghematan' terdengar lebih netral daripada 'pemangkasan habis-habisan', meskipun keduanya dapat membingkai langkah yang sama.",
    "Sparprogramm und Kahlschlag sind in jedem Kontext völlig gleichbedeutend.",
    "Die Wörter können auf denselben Vorgang verweisen, bewerten ihn aber unterschiedlich."
  ),
  s(
    "Idiom hanya tepat jika register dan situasi mendukung. Dalam teks formal, idiom dapat memberi ketajaman, tetapi terlalu banyak membuat argumen terasa teatrikal.",
    "Idiom erkennen → wörtliche Bedeutung verwerfen → Registerwirkung prüfen",
    "Die Kommission fasste eine grundlegende Reform ins Auge, scheute jedoch vor den politischen Kosten zurück.",
    "Komisi mempertimbangkan reformasi mendasar, tetapi mundur menghadapi biaya politiknya.",
    "Die Kommission nahm eine Reform in das Auge.",
    "Die Kommission fasste eine Reform ins Auge."
  ),
  s(
    "Kolokasi tingkat mahir terdengar alami karena pasangan katanya lazim: Zweifel sind berechtigt, Folgen gravierend, Kritik vernichtend atau differenziert.",
    "Nomen + typisches Verb/Adjektiv als feste Gebrauchseinheit",
    "An der Tragfähigkeit des Modells bestehen berechtigte Zweifel, zumal geringfügige Änderungen gravierende Folgen haben.",
    "Ada keraguan beralasan terhadap ketahanan model itu, terlebih perubahan kecil memiliki dampak serius.",
    "An dem Modell existieren richtige Zweifel und schwere Folgen passieren.",
    "An dem Modell bestehen berechtigte Zweifel; Änderungen haben gravierende Folgen."
  ),
  s(
    "Pembentukan kata memungkinkan makna padat, tetapi neologisme harus dapat ditafsirkan dari unsur dan konteksnya. Bedakan bentuk mapan dari ciptaan sesaat.",
    "Stamm + Affix/Kompositum → transparente Bedeutung + kontextuelle Prüfung",
    "Der Begriff „klimaresilient“ bezeichnet Systeme, die auch unter veränderten Klimabedingungen funktionsfähig bleiben.",
    "Istilah 'tangguh terhadap iklim' menyebut sistem yang tetap berfungsi dalam kondisi iklim yang berubah.",
    "Jedes verständliche Kompositum ist automatisch ein etabliertes Fachwort.",
    "Ein neues Kompositum kann verständlich sein, ohne bereits allgemein etabliert zu sein."
  ),
  s(
    "Implikatur adalah makna yang disimpulkan dari kerja sama percakapan dan konteks, bukan isi literal. Selalu pertimbangkan lebih dari satu tafsir yang masuk akal.",
    "Äußerung + Situation + gemeinsame Annahmen → mögliche indirekte Absicht",
    "Die Antwort „Es ist schon ziemlich spät“ kann auf eine Einladung indirekt eine Ablehnung signalisieren.",
    "Jawaban 'Sudah cukup larut' dapat secara tidak langsung menandai penolakan atas undangan.",
    "Der Satz „Es ist spät“ bedeutet in jedem Fall „Nein“.",
    "Der Satz kann eine Ablehnung implizieren, wenn der Gesprächskontext dies nahelegt."
  ),
  s(
    "Ironi menyampaikan jarak antara ujaran literal dan sikap yang dimaksud; sarkasme biasanya lebih tajam dan dapat menyerang. Intonasi dan relasi sosial menentukan efek.",
    "positiver Wortlaut + negativer Kontext → mögliche Ironie · Angriffspotenzial → Sarkasmus",
    "Nach dem dritten Systemausfall wirkte die Bemerkung „wirklich beeindruckende Zuverlässigkeit“ unverkennbar ironisch.",
    "Setelah kegagalan sistem ketiga, komentar 'keandalan yang benar-benar mengesankan' terdengar jelas ironis.",
    "Jedes übertriebene Lob ist automatisch Sarkasmus.",
    "Ob übertriebenes Lob ironisch oder sarkastisch wirkt, hängt von Kontext und Ziel ab."
  ),
  s(
    "Referensi budaya membantu memahami teks, tetapi pengetahuan latar tidak boleh dipakai untuk memaksakan satu tafsir. Jelaskan referensinya lalu kembali ke bukti teks.",
    "Referenz identifizieren → Hintergrund klären → Textfunktion prüfen → Deutung begrenzen",
    "Die Wendung „jemandem den Schwarzen Peter zuschieben“ bezeichnet die Weitergabe von Verantwortung oder Schuld.",
    "Ungkapan 'menyerahkan kartu Peter Hitam kepada seseorang' berarti melempar tanggung jawab atau kesalahan.",
    "Die Redewendung beweist, dass die genannte Person tatsächlich schuldig ist.",
    "Die Redewendung beschreibt eine Zuschreibung von Schuld, nicht deren objektiven Nachweis."
  ),
  s(
    "Elipsis menghilangkan unsur yang dapat dipulihkan dari konteks. Ia memberi kecepatan dan kepadatan, tetapi menjadi kabur jika acuan atau struktur paralelnya tidak jelas.",
    "vollständige Parallelstruktur → kontextuell erschließbare Auslassung",
    "Je früher die Entscheidung, desto größer der Handlungsspielraum.",
    "Semakin awal keputusan diambil, semakin besar ruang untuk bertindak.",
    "Je früher die Entscheidung, weil desto größer der Handlungsspielraum.",
    "Je früher die Entscheidung, desto größer der Handlungsspielraum."
  ),
  s(
    "Ritme kalimat lahir dari variasi panjang, struktur informasi, dan posisi fokus. Tempatkan informasi lama sebagai pijakan dan informasi baru pada posisi menonjol.",
    "Thema/Gegebenes → Entwicklung → Rhema/Neues im Fokus",
    "Unbestritten ist der Handlungsbedarf. Offen bleibt hingegen, welche Maßnahme unter realen Bedingungen trägt.",
    "Kebutuhan untuk bertindak tidak diperdebatkan. Namun yang masih terbuka ialah langkah mana yang bertahan dalam kondisi nyata.",
    "Es ist der Handlungsbedarf unbestritten, und es bleibt die Maßnahme offen, welche trägt.",
    "Der Handlungsbedarf ist unbestritten. Offen bleibt, welche Maßnahme trägt."
  ),
  s(
    "Ambiguitas dapat muncul dari lampiran preposisional, pronomina, cakupan negasi, atau polisemi. Parafrase setiap tafsir sebelum memilih berdasarkan konteks.",
    "mehrdeutige Struktur → Lesart A + Lesart B → disambiguierende Formulierung",
    "Der Satz „Sie beobachtete den Mann mit dem Fernglas“ lässt offen, wer das Fernglas benutzte.",
    "Kalimat 'Ia mengamati pria dengan teropong' tidak menjelaskan siapa yang menggunakan teropong.",
    "Der Satz hat eindeutig nur eine mögliche Bedeutung.",
    "Die Beobachterin benutzte ein Fernglas, um den Mann zu beobachten."
  ),
  s(
    "Kompetensi genre berarti memenuhi harapan bentuk dan sekaligus mengendalikannya secara sadar. Editorial, abstrak, pidato, dan ulasan memiliki kontrak pembaca berbeda.",
    "kommunikativer Zweck → Genrekonvention → bewusste Variation",
    "Ein Abstract nennt Fragestellung, Methode, zentrale Ergebnisse und Schlussfolgerung, ohne den argumentativen Weg vollständig nachzuerzählen.",
    "Sebuah abstrak menyebut pertanyaan, metode, hasil utama, dan kesimpulan tanpa menceritakan seluruh jalur argumen.",
    "Ein Abstract beginnt am besten mit einer persönlichen Anekdote und hält das Ergebnis geheim.",
    "Ein Abstract macht Ziel, Vorgehen und Hauptergebnis knapp zugänglich."
  ),
  s(
    "Majas bekerja melalui hubungan bentuk dan makna. Metafora memindahkan kerangka, paralelisme menegaskan struktur, antitesis mempertajam kontras.",
    "Metapher → Deutungsrahmen · Parallelismus → Nachdruck · Antithese → Kontrast",
    "Nicht der Mangel an Daten, sondern der Mangel an Urteilskraft bildet den Engpass.",
    "Bukan kekurangan data, melainkan kekurangan daya penilaian yang menjadi hambatan.",
    "Nicht Daten fehlen, aber Urteilskraft fehlt der Engpass.",
    "Nicht die Daten fehlen; vielmehr fehlt es an Urteilskraft."
  ),
  s(
    "Argumen kompleks tetap memerlukan satu pertanyaan pusat. Bedakan premis, keberatan, pengecualian, dan konsekuensi agar kerumitan tidak berubah menjadi kabut.",
    "Leitthese → Prämissen → Einwand → Qualifikation → Konsequenz",
    "Selbst wenn die Maßnahme kurzfristig effizient wäre, bliebe zu klären, ob ihre langfristigen Nebenfolgen den Nutzen nicht relativieren.",
    "Sekalipun langkah itu efisien dalam jangka pendek, masih perlu dijelaskan apakah dampak samping jangka panjang tidak mengurangi manfaatnya.",
    "Die Maßnahme ist effizient, also sind alle Einwände unwichtig.",
    "Die Effizienz beantwortet nicht automatisch die Frage nach langfristigen Nebenfolgen."
  ),
  s(
    "Evaluasi presisi menyebut standar, bukti, dan tingkat keyakinan. Hindari kata mutlak ketika cakupan data terbatas.",
    "Kriterium + Befund + Reichweite + Unsicherheitsmarker",
    "Gemessen an der internen Konsistenz ist das Modell überzeugend; seine externe Gültigkeit lässt sich anhand der vorliegenden Daten jedoch kaum beurteilen.",
    "Diukur dari konsistensi internal, model itu meyakinkan; namun validitas eksternalnya hampir tidak dapat dinilai berdasarkan data yang ada.",
    "Das Modell ist objektiv perfekt, obwohl nur interne Daten vorliegen.",
    "Intern ist das Modell konsistent; seine Übertragbarkeit bleibt offen."
  ),
  s(
    "Mediasi C2 mempertahankan sikap, implikasi, dan kekuatan klaim sambil menyesuaikan budaya dan register. Jangan menaikkan indikasi menjadi kepastian.",
    "Inhalt + Haltung + Evidenzstärke + kulturelle Funktion → adressatengerechte Fassung",
    "Die Quelle bewertet den Befund zurückhaltend: Sie sieht einen Hinweis, ausdrücklich jedoch keinen abschließenden Beleg.",
    "Sumber menilai temuan secara hati-hati: ada indikasi, tetapi secara eksplisit bukan bukti final.",
    "Die Quelle beweist endgültig, dass die Annahme stimmt.",
    "Die Quelle liefert einen Hinweis, aber keinen abschließenden Beleg."
  ),
  s(
    "Editorial menggabungkan tesis yang tajam dengan fakta yang adil, suara yang konsisten, dan ajakan yang dapat dipertanggungjawabkan.",
    "aktueller Anlass → pointierte These → faire Abwägung → klare Konsequenz",
    "Wer Transparenz fordert, darf Unsicherheit nicht als Schwäche verschweigen; gerade ihre Benennung macht Entscheidungen belastbar.",
    "Siapa yang menuntut transparansi tidak boleh menyembunyikan ketidakpastian sebagai kelemahan; justru penyebutannya membuat keputusan dapat diandalkan.",
    "Alle, die anderer Meinung sind, haben die Fakten nicht verstanden.",
    "Eine pointierte Position bleibt glaubwürdig, wenn sie Gegenargumente fair behandelt."
  ),
  s(
    "Interpretasi sastra berawal dari detail bentuk dan bahasa, lalu menawarkan pembacaan yang dapat diuji. Biografi pengarang bukan jalan pintas menuju satu makna pasti.",
    "Textdetail → formale Wirkung → Deutungshypothese → Gegenprobe am Text",
    "Der abrupte Wechsel ins Präsens kann die erinnerte Szene vergegenwärtigen; ob er tatsächlich Nähe erzeugt, ist am weiteren Text zu prüfen.",
    "Peralihan mendadak ke kala kini dapat menghadirkan kembali adegan yang diingat; apakah benar menciptakan kedekatan perlu diuji pada teks selanjutnya.",
    "Der Präsenswechsel beweist eindeutig, was der Autor persönlich fühlte.",
    "Der Präsenswechsel stützt eine Deutung, beweist aber keine biografische Absicht."
  ),
  s(
    "Sanggahan akademik tingkat lanjut merekonstruksi argumen lawan dalam versi terkuat sebelum menguji premis, metode, atau jangkauannya.",
    "stärkste Fassung → Prämissenprüfung → Evidenzprüfung → begrenztes Gegenurteil",
    "Das Argument überzeugt unter der Annahme stabiler Rahmenbedingungen. Gerade diese Annahme ist jedoch empirisch nicht abgesichert.",
    "Argumen itu meyakinkan dengan asumsi kondisi kerangka stabil. Namun justru asumsi itu tidak didukung secara empiris.",
    "Das Argument ist lächerlich und muss deshalb falsch sein.",
    "Das Argument ist nachvollziehbar; angreifbar ist jedoch seine unbelegte Ausgangsannahme."
  ),
  s(
    "Pergantian register mempertahankan maksud sambil mengubah sapaan, kepadatan, humor, terminologi, dan derajat keterusterangan.",
    "gleiche Intention → andere Beziehung + anderes Medium → neue sprachliche Form",
    "Formell: „Eine kurzfristige Rückmeldung wäre hilfreich.“ Informell: „Gib mir bitte kurz Bescheid.“",
    "Formal: 'Tanggapan singkat akan membantu.' Informal: 'Kabari sebentar ya.'",
    "Gib mir gefälligst unverzüglich eine Rückmeldung, Bro.",
    "Bitte geben Sie mir zeitnah Rückmeldung. / Gib mir bitte kurz Bescheid."
  ),
  s(
    "Memadatkan teks mempertahankan proposisi inti dan hubungan logis; memperluas teks mengungkap asumsi, contoh, dan batas tanpa mengubah klaim.",
    "Kompression: Kern + Relation · Expansion: Kern + explizite Begründung + Beispiel + Grenze",
    "Kurz: „Die Wirkung ist kontextabhängig.“ Erweitert: „Ob die Maßnahme wirkt, hängt unter anderem von Zielgruppe, Dauer und Umsetzung ab.“",
    "Singkat: 'Dampaknya bergantung konteks.' Diperluas: 'Apakah langkah itu efektif bergantung antara lain pada kelompok sasaran, durasi, dan penerapan.'",
    "Beim Kürzen dürfen Einschränkungen entfallen, weil nur die Hauptaussage zählt.",
    "Auch eine Kurzfassung muss entscheidende Einschränkungen bewahren."
  ),
  s(
    "Polishing akhir memeriksa diksi, rujukan, ritme, proporsi, transisi, dan nada. Perbaikan terbaik sering berupa penghapusan, bukan penambahan.",
    "Präzision → Kohärenz → Rhythmus → Register → Kürzung → Schlusskontrolle",
    "Die überarbeitete Fassung benennt den Befund präzise, begrenzt seine Reichweite und führt ohne Umweg zur Konsequenz.",
    "Versi revisi menyebut temuan secara presisi, membatasi cakupannya, dan langsung mengarah pada konsekuensi.",
    "Die überarbeitete und neu revidierte Endfassung benennt präzise und genau den Befund.",
    "Die überarbeitete Fassung benennt den Befund präzise."
  ),
];

const advancedUnits: Record<AdvancedLevel, AdvancedSeed[]> = {
  A2: a2Units,
  B1: b1Units,
  B2: b2Units,
  C1: c1Units,
  C2: c2Units,
};

const trackContexts: Record<LearningTrack, string> = {
  study: "situasi kampus, seminar, atau kehidupan mahasiswa",
  career: "situasi kerja, Ausbildung, atau komunikasi profesional",
  daily: "perjalanan dan kebutuhan hidup sehari-hari",
  general: "situasi nyata yang dekat dengan minat dan keseharianmu",
};

function applicationFor(level: AdvancedLevel, day: number, goal: string, seed: AdvancedSeed) {
  const track = learningTrack(goal);
  const dayMeta = daysForLevel(level)[day - 1];
  const task = `Buat respons 2-4 kalimat untuk ${trackContexts[track]} dengan fokus “${dayMeta.theme}”. Jangan menyalin contoh; ubah pelaku, waktu, atau rinciannya.`;
  const criteria = [
    `Isi relevan dengan ${dayMeta.theme.toLowerCase()}.`,
    `Pola utama “${seed.formula}” diterapkan secara dapat dipahami.`,
    level === "A2" ? "Kalimat pendek dan jelas." : "Pilihan kata dan register sesuai konteks.",
  ];
  return {
    track: trackNames[track],
    outcome: `Menggunakan ${dayMeta.skill} untuk tugas komunikatif baru.`,
    task,
    criteria,
    fieldTask: `Setelah jeda, ulangi tugas untuk ${trackContexts[track]} dengan contoh dan rincian yang seluruhnya berbeda.`,
  };
}

function answerOptions(correct: string, distractor: string, other: string, offset: number) {
  const position = offset % 3;
  return {
    options: position === 0 ? [correct, distractor, other]
      : position === 1 ? [other, correct, distractor]
        : [distractor, other, correct],
    correctIndex: position,
  };
}

function quizSteps(seed: AdvancedSeed, theme: string, day: number): LessonStep[] {
  return [
    {
      type: "drill",
      title: "Kenali bentuk yang tepat",
      exercise: {
        prompt: `Kalimat mana yang paling tepat menerapkan fokus “${theme}”?`,
        ...answerOptions(seed.example, seed.wrong, "Heute lerne ich Deutsch.", day),
        explanation: `Bentuk “${seed.example}” menerapkan fokus hari ini. Bentuk “${seed.wrong}” kurang sesuai dengan fokus tersebut; kalimat umum tentang belajar tidak menunjukkan pola yang sedang diuji.`,
      },
    },
    {
      type: "drill",
      title: "Perbaiki kesalahan",
      exercise: {
        prompt: `Pilih perbaikan yang benar untuk: “${seed.wrong}”`,
        ...answerOptions(seed.correct, seed.wrong, "Tidak perlu diubah.", day + 1),
        explanation: `Bentuk yang tepat adalah “${seed.correct}” karena mengikuti pola ${seed.formula}.`,
      },
    },
    {
      type: "drill",
      title: "Ingat polanya",
      exercise: {
        prompt: "Ringkasan mana yang sesuai dengan pelajaran hari ini?",
        ...answerOptions(seed.formula, "Semua unsur boleh ditempatkan tanpa pola.", "Bentuk kata tidak pernah berubah.", day + 2),
        explanation: "Ringkasan yang tepat mengikuti pola yang baru dipelajari; dua pilihan lain terlalu mutlak dan tidak sesuai tata bahasa Jerman.",
      },
    },
  ];
}

function buildUnitLesson(level: AdvancedLevel, day: number, goal: string, seed: AdvancedSeed): Lesson {
  const meta = daysForLevel(level)[day - 1];
  const application = applicationFor(level, day, goal, seed);
  const track = learningTrack(goal);
  return {
    day,
    subLevel: meta.subLevel,
    title: meta.theme,
    estimatedMinutes: meta.estimatedMinutes,
    goal: [application.outcome, `Memahami pola: ${seed.formula}`, "Menerapkan pola pada situasi yang berbeda dari contoh."],
    application,
    steps: [
      {
        type: "story",
        title: "Masuk ke situasi nyata",
        body: `Hari ini kamu berlatih ${meta.theme.toLowerCase()} dalam ${trackContexts[track]}. Fokusnya bukan menghafal satu kalimat, tetapi memilih struktur yang tepat ketika informasi berubah.`,
      },
      { type: "pattern", title: "Pola inti", body: seed.body, formula: seed.formula },
      { type: "example", title: "Contoh bermakna", german: seed.example, indonesian: seed.meaning },
      ...quizSteps(seed, meta.theme, day),
      {
        type: "listening",
        title: "Tangkap makna utama",
        exercise: {
          audioText: seed.example,
          prompt: "Apa makna utama kalimat yang kamu dengar?",
          ...answerOptions(seed.meaning, "Pembicara menyampaikan makna yang berlawanan.", "Informasi itu tidak disebutkan.", day + 1),
          explanation: `Kalimat tersebut bermakna: ${seed.meaning}`,
        },
      },
      {
        type: "writing",
        title: "Terapkan pada konteksmu",
        assessment: "open",
        missionId: `${level.toLowerCase()}-${track}-${day}`,
        prompt: application.task,
        expected: seed.example,
        criteria: application.criteria,
      },
      {
        type: "speaking",
        title: "Sampaikan tanpa membaca",
        assessment: "open",
        prompt: `Jelaskan secara lisan jawabanmu untuk fokus “${meta.theme}”. Gunakan rincian baru dan jangan membaca contoh.`,
        expected: seed.example,
        criteria: application.criteria,
      },
      {
        type: "mistake",
        title: "Kesalahan yang perlu dihindari",
        wrong: seed.wrong,
        correct: seed.correct,
        contrastLabels: { before: "Kurang tepat untuk fokus ini", after: "Versi yang sesuai" },
        body: `Periksa struktur, register, dan kekuatan klaim. Bentuk pertama dapat kurang sesuai meskipun tidak selalu salah secara grammar. Gunakan pola “${seed.formula}” sebagai panduan.`,
      },
      {
        type: "victory",
        title: "Sesi selesai",
        body: "Selesai satu sesi berarti kamu sudah berlatih, bukan otomatis menguasai. Uji lagi pada situasi baru setelah jeda.",
        achievements: [application.outcome, `Latihan transfer: ${application.fieldTask}`],
      },
    ],
  };
}

function unitsBeforeCheckpoint(day: number): readonly number[] {
  if (day === 7) return [1, 2, 3, 4, 5, 6];
  if (day === 14) return [8, 9, 10, 11, 12, 13];
  if (day === 15) return TEACHING_DAYS.slice(0, 12);
  if (day === 21) return [16, 17, 18, 19, 20];
  if (day === 28) return [22, 23, 24, 25, 26, 27];
  if (day === 29) return [19, 20, 22, 23, 24, 25, 26, 27];
  return TEACHING_DAYS;
}

function seedForTeachingDay(level: AdvancedLevel, day: number): AdvancedSeed {
  const index = TEACHING_DAYS.indexOf(day as (typeof TEACHING_DAYS)[number]);
  return advancedUnits[level][index];
}

function buildCheckpointLesson(level: AdvancedLevel, day: number, goal: string): Lesson {
  const meta = daysForLevel(level)[day - 1];
  const sourceDays = unitsBeforeCheckpoint(day);
  const source = sourceDays.map((sourceDay) => ({
    day: sourceDay,
    meta: daysForLevel(level)[sourceDay - 1],
    seed: seedForTeachingDay(level, sourceDay),
  }));
  const selected = [source[0], source[Math.floor(source.length / 2)], source[source.length - 1]];
  const anchor = selected[2].seed;
  const application = applicationFor(level, day, goal, anchor);
  const track = learningTrack(goal);
  const isRemedial = day === 29;
  const isFinal = day === 15 || day === 28 || day === 30;
  const criteria = [
    `Gunakan sekurangnya dua pola dari: ${selected.map((item) => item.meta.theme).join("; ")}.`,
    "Respons memiliki isi yang saling terhubung dan dapat dipahami.",
    "Periksa ulang bentuk verba, kasus, serta register sebelum selesai.",
  ];
  return {
    day,
    subLevel: meta.subLevel,
    title: meta.theme,
    estimatedMinutes: meta.estimatedMinutes + (isFinal ? 15 : 5),
    goal: [
      isRemedial ? "Memperbaiki pola yang masih sering salah." : "Menggabungkan materi tanpa bergantung pada satu contoh.",
      `Meninjau ${source.length} fokus belajar sebelumnya.`,
      "Mencoba tugas produktif dengan kriteria yang jelas.",
    ],
    application: { ...application, criteria },
    steps: [
      {
        type: "story",
        title: isRemedial ? "Perbaiki dengan sengaja" : "Checkpoint, bukan garis akhir",
        body: isRemedial
          ? "Pilih pola yang paling sering membuatmu ragu. Jelaskan penyebabnya, perbaiki bentuknya, lalu gunakan pada kalimat baru."
          : "Checkpoint ini menguji apakah kamu dapat memilih beberapa pola untuk situasi baru. Skor satu sesi bukan sertifikat level dan tetap perlu dibuktikan lagi setelah jeda.",
      },
      {
        type: "pattern",
        title: "Peta materi",
        body: source.map((item) => `${item.meta.theme}: ${item.seed.formula}`).join(" · "),
        formula: selected.map((item) => item.seed.formula).join(" · "),
      },
      { type: "example", title: "Contoh integrasi", german: selected[0].seed.example, indonesian: selected[0].seed.meaning },
      ...selected.map((item, index): LessonStep => ({
        type: "drill",
        title: `Cek pola ${index + 1}`,
        exercise: {
          prompt: `Pilih bentuk yang benar untuk fokus “${item.meta.theme}”.`,
          ...answerOptions(item.seed.correct, item.seed.wrong, "Keduanya selalu benar.", day + index),
          explanation: `Bentuk “${item.seed.correct}” mengikuti pola ${item.seed.formula}; bentuk lainnya tidak sesuai dengan fokus yang sedang diuji.`,
        },
      })),
      {
        type: "listening",
        title: "Dengar dan simpulkan",
        exercise: {
          audioText: anchor.example,
          prompt: "Apa inti kalimat yang kamu dengar?",
          ...answerOptions(anchor.meaning, "Maknanya kebalikan dari informasi tersebut.", "Tidak ada informasi yang dapat dikenali.", day + 1),
          explanation: `Makna utamanya adalah: ${anchor.meaning}`,
        },
      },
      {
        type: "writing",
        title: isFinal ? "Tugas integrasi tertulis" : "Tulis respons baru",
        assessment: "open",
        missionId: `${level.toLowerCase()}-${track}-${day}`,
        prompt: `${application.task} Gabungkan sekurangnya dua pola yang ditinjau hari ini.`,
        expected: `${selected[0].seed.example} ${anchor.example}`,
        criteria,
      },
      {
        type: "speaking",
        title: "Jelaskan pilihanmu",
        assessment: "open",
        prompt: "Sampaikan responsmu secara lisan, lalu jelaskan singkat pola mana yang kamu pilih dan mengapa.",
        expected: anchor.example,
        criteria,
      },
      {
        type: "mistake",
        title: "Satu pola yang wajib diperiksa",
        wrong: anchor.wrong,
        correct: anchor.correct,
        contrastLabels: { before: "Kurang tepat untuk fokus ini", after: "Versi yang sesuai" },
        body: `Periksa dengan rumus: ${anchor.formula}`,
      },
      {
        type: "victory",
        title: "Checkpoint selesai",
        body: "Catat bagian yang masih membutuhkan bantuan. Penguasaan baru lebih kuat jika kamu berhasil lagi pada tugas berbeda setelah jeda.",
        achievements: [
          `Meninjau ${source.length} fokus materi ${level}.`,
          isRemedial ? "Mengubah satu kesalahan menjadi latihan baru." : "Menyelesaikan tugas integrasi tanpa klaim penguasaan otomatis.",
        ],
      },
    ],
  };
}

export function getAdvancedLesson(level: AdvancedLevel, day: number, goal = ""): Lesson | undefined {
  if (!Number.isInteger(day) || day < 1 || day > 30) return undefined;
  const units = advancedUnits[level];
  if (!units || units.length !== TEACHING_DAYS.length) return undefined;
  if (TEACHING_DAYS.includes(day as (typeof TEACHING_DAYS)[number])) {
    return buildUnitLesson(level, day, goal, seedForTeachingDay(level, day));
  }
  return buildCheckpointLesson(level, day, goal);
}

/** Attach the same auditable application mission to an optional AI variant. */
export function personalizeAdvancedLesson(
  base: Lesson,
  level: AdvancedLevel,
  goal = ""
): Lesson {
  const sourceDay = TEACHING_DAYS.includes(base.day as (typeof TEACHING_DAYS)[number])
    ? base.day
    : unitsBeforeCheckpoint(base.day).at(-1) ?? 1;
  const seed = seedForTeachingDay(level, sourceDay);
  if (!seed) return base;
  const application = applicationFor(level, base.day, goal, seed);
  const track = learningTrack(goal);
  let missionAttached = false;
  const steps = base.steps.map((step) => {
    if (missionAttached || step.type !== "writing" || step.assessment !== "open") return step;
    missionAttached = true;
    return {
      ...step,
      missionId: `${level.toLowerCase()}-${track}-${base.day}`,
      criteria: step.criteria?.length ? step.criteria : application.criteria,
    };
  });
  return { ...base, application, steps };
}

export function advancedMissionReviewStep(
  level: AdvancedLevel,
  day: number,
  goal = ""
): LessonStep {
  const lesson = getAdvancedLesson(level, day, goal);
  const application = lesson?.application;
  return {
    type: "writing",
    title: `Coba situasi baru · ${level}`,
    assessment: "open",
    prompt: `${application?.fieldTask ?? "Buat respons baru menggunakan pola yang sudah dipelajari."} Fokus: ${lesson?.title ?? level}. Jangan melihat atau menyalin jawaban lama.`,
    expected: "",
    criteria: application?.criteria ?? ["Respons sesuai tugas dan dapat dipahami."],
    missionId: `${level.toLowerCase()}-${learningTrack(goal)}-${day}-review`,
  };
}

export function advancedLessonCoverage(): Record<AdvancedLevel, number> {
  return Object.fromEntries(
    (Object.keys(advancedUnits) as AdvancedLevel[]).map((level) => [level, advancedUnits[level].length])
  ) as Record<AdvancedLevel, number>;
}
