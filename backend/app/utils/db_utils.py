import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',
        database='postgres',
        user='macbookair',
        password='7403'
    )
    conn.set_client_encoding('UTF8') 
    return conn