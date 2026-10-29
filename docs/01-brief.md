# 01 — Brief: Deck Interaktif Modul 07 (REST API & Retrofit)

## 1. Tujuan
Alat bantu ajar interaktif yang menunjukkan **bagaimana data dari internet berubah wujud** sampai tampil di layar, dan **di mana batas tanggung jawab tiap layer**. Praktikan tidak boleh bingung membedakan peran: Retrofit, DTO, mapper, repository, ViewModel, dan UI.

## 2. Hubungan dengan Modul 06
Modul 07 mengganti sumber data in-memory dengan REST API tanpa meruntuhkan arsitektur Modul 06. Deck ini adalah lanjutan: pada Modul 06 (Scene 6) sudah dijanjikan bahwa saat sumber data diganti ke REST, Repository dan ViewModel menyesuaikan dan UI tetap tidak mengenal sumber data. Deck ini membuktikannya.

## 3. Audiens
Mahasiswa PAPB FILKOM UB yang sudah menyelesaikan Modul 06 (UI, ViewModel, Repository, Data Source).

## 4. Sumber kebenaran materi
Modul Praktikum 07. Nama di layar harus sama dengan modul:

| Bagian | Nama di modul |
|---|---|
| Endpoint uji | `https://dummyjson.com/users?limit=10` |
| DTO | `UserDto(id, firstName, lastName, email, university)`, `UserResponse(users, total, skip, limit)` |
| Model aplikasi | `Student(id, name, email, university)` (sebelumnya program/year di Modul 06) |
| Mapper | `fun UserDto.toStudent()` |
| Retrofit | `StudentApiService` (`@GET("users")`, `@GET("users/{id}")`), `RetrofitClient` |
| Remote Data Source | `StudentRemoteDataSource` (`Call.enqueue`, `Result<T>`) |
| Repository | `StudentRepository`, `DefaultStudentRepository` (callback + pemetaan DTO → Student) |
| ViewModel/State | `HomeViewModel`, `HomeUiState`, `DetailViewModel`, `DetailUiState` (`isLoading`, `errorMessage`) |

Arah dependency: `UI → ViewModel → Repository → Remote Data Source → REST API`. Event ke kanan, response/state ke kiri.

## 5. Cakupan (8 scene)
Lima poin inti dari permintaan dosen, ditambah tiga scene pendukung:
1. Rekap: dari in-memory ke REST (pendukung)
2. Siklus request-response HTTP
3. Aliran data lintas layer dan larangan jalan pintas
4. Transformasi DTO ke Student
5. Callback asinkron (`enqueue`, `onResponse`, `onFailure`, `Result`)
6. Tiga kondisi layar (loading, error, sukses)
7. Dari mana error berasal? (pendukung, boleh dipangkas)
8. Peta perubahan dari Modul 06 dan jembatan ke Coroutines/Flow (pendukung penutup)

Total 39 state (38 kali Next), 1206 frame, estimasi ±15 menit. Scene 1, 7, dan 8 dapat dipangkas tanpa mengubah scene lain (nomor state dihitung dari `stops.ts`).

## 6. Spesifikasi
Sama dengan Modul 06: Vite + React + TS + `@remotion/player`, 1920×1080, 30 fps, navigasi berbasis Stop, web statis offline.

## 7. Non-goals
- Tidak ada panggilan jaringan nyata dan tidak ada implementasi Retrofit yang berjalan. Semua JSON adalah konstanta.
- Tidak membahas POST/PUT/DELETE, Firebase, Coroutines, Flow, atau Room (Coroutines/Flow hanya label teaser di akhir).
- Tidak ada tombol di layar, form, scroll, speaker notes, atau teks narasi di layar.
- Tidak menampilkan field sensitif palsu dari DummyJSON (password, ssn, nomor kartu, iban, wallet).

## 8. Koreksi konsep yang dijaga di deck ini
- `total`, `skip`, `limit` adalah milik `UserResponse` (pembungkus), BUKAN `UserDto`.
- `onResponse` TIDAK selalu berarti sukses: status 404/500 juga masuk `onResponse`; sukses hanya jika `response.isSuccessful && body != null`.
- Kegagalan datang dari tiga tempat (`onFailure`, `isSuccessful = false`, body null) dan semuanya menjadi `Result.failure`.
- Gson menghasilkan DTO, bukan `Student`; pemetaan ke `Student` dilakukan Repository.
- Biru dan hijau sudah menjadi warna lapisan (UI dan Repository), jadi tidak dipakai sebagai warna partikel event/response.

## 9. Kriteria sukses
Dosen menjalankan seluruh deck hanya dengan keyboard/klik di proyektor 1080p tanpa internet; maju-mundur menghasilkan tampilan identik untuk state yang sama; semua istilah dan nama kelas sesuai Modul 07.
