SELECT table_name, column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name IN ('Hadith', 'SunnahPractice', 'QuestionAnswer')
ORDER BY table_name, column_name;
