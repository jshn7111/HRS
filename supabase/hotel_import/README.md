# Supabase Hotel Import Chunks

The single `data/hotels.sql` file is large, so the 5000 hotels are split into 20 smaller chunks of 250 rows each.

Run order in Supabase SQL Editor:

1. Run `../complete_setup.sql`
2. Run `00_prepare_import.sql`
3. Optional: run `00_clear_hotels.sql` if you want a clean hotel table
4. Run `part_01.sql`
5. Run `part_02.sql`
6. Run `part_03.sql`
7. Run `part_04.sql`
8. Run `part_05.sql`
9. Run `part_06.sql`
10. Run `part_07.sql`
11. Run `part_08.sql`
12. Run `part_09.sql`
13. Run `part_10.sql`
14. Run `part_11.sql`
15. Run `part_12.sql`
16. Run `part_13.sql`
17. Run `part_14.sql`
18. Run `part_15.sql`
19. Run `part_16.sql`
20. Run `part_17.sql`
21. Run `part_18.sql`
22. Run `part_19.sql`
23. Run `part_20.sql`

Total hotels: 5000

Each chunk uses `ON CONFLICT (hotel_name) DO UPDATE`, so re-running a chunk refreshes existing rows instead of duplicating hotels.
