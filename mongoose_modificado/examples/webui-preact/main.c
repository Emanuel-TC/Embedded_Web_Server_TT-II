// Copyright (c) 2022 Cesanta Software Limited
// All rights reserved
//
// UI example
// It implements the following endpoints:
//    /api/config/get - respond with current config
//    /api/config/set - POST a config change
//    any other URI serves static files from s_root_dir
// Data and results are JSON strings

#include "mongoose.h"
#include <sqlite3.h>


static const char *s_http_addr = "http://localhost:8000";  // HTTP port
static const char *s_root_dir = "/home/pi/Documents/servidorweb/Embedded_Web_Server_TT-II/my_server";
#define MQTT_SERVER "mqtt://broker.hivemq.com:1883"
#define MQTT_PUBLISH_TOPIC "mg/my_device"
#define MQTT_SUBSCRIBE_TOPIC "mg/#"

sqlite3 *db;

static struct config {
  char *url, *pub, *sub;
} s_config;

// Try to update a single configuration value
static void update_config(struct mg_str json, const char *path, char **value) {
  char *jval;
  if ((jval = mg_json_get_str(json, path)) != NULL) {
    free(*value);
    *value = strdup(jval);
  }
}


//COnsultas SQLite
		//consulta general
static char *query_database(sqlite3 *db) {
  sqlite3_stmt *stmt;
  const char *sql = "SELECT * FROM muestras;";
  char *json_result = NULL;
  int rc;

  rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
  if (rc != SQLITE_OK) {
    fprintf(stderr, "Error al preparar la consulta: %s\n", sqlite3_errmsg(db));
    return NULL;
  }

  json_result = strdup("[");
    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        const unsigned char *date = sqlite3_column_text(stmt, 1);
        const unsigned char *time = sqlite3_column_text(stmt, 2);
        double voltageRMS = sqlite3_column_double(stmt, 3);
        double linef = sqlite3_column_double(stmt, 4);
        double powerf = sqlite3_column_double(stmt, 5);
        double currentRMS = sqlite3_column_double(stmt, 6);
        double activep = sqlite3_column_double(stmt, 7);
        double reactivep = sqlite3_column_double(stmt, 8);
        double apparentp = sqlite3_column_double(stmt, 9);

        char buf[512];
        snprintf(buf, sizeof(buf), "{\"ID\": %d, \"Fecha\": \"%s\", \"Hora\": \"%s\", \"Voltaje RMS\": %f, \"Línea de Frecuencia\": %f, \"Factor de Potencia\": %f, \"Corriente RMS\": %f, \"Potencia Activa\": %f, \"Potencia Reactiva\": %f, \"Potencia Aparente\": %f},", id, date, time, voltageRMS, linef, powerf, currentRMS, activep, reactivep, apparentp);
        json_result = realloc(json_result, strlen(json_result) + strlen(buf) + 1);
        strcat(json_result, buf);
  }

  if (strlen(json_result) > 1) {
    json_result[strlen(json_result) - 1] = ']';  // Reemplaza la última coma por un corchete de cierre
  } else {
    json_result = realloc(json_result, strlen(json_result) + 2);
    strcat(json_result, "]");
  }

  sqlite3_finalize(stmt);
  return json_result;
}
//		Fin consulta general

//		consulta últimos 20 datos
static char *query_database_20_ultimos(sqlite3 *db) {
  sqlite3_stmt *stmt;
  const char *sql = "SELECT * FROM (SELECT * FROM muestras ORDER BY id DESC LIMIT 20) ORDER BY id ASC;";
  char *json_result = NULL;
  int rc;

  rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
  if (rc != SQLITE_OK) {
    fprintf(stderr, "Error al preparar la consulta: %s\n", sqlite3_errmsg(db));
    return NULL;
  }

  json_result = strdup("[");
    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        const unsigned char *date = sqlite3_column_text(stmt, 1);
        const unsigned char *time = sqlite3_column_text(stmt, 2);
        double voltageRMS = sqlite3_column_double(stmt, 3);
        double linef = sqlite3_column_double(stmt, 4);
        double powerf = sqlite3_column_double(stmt, 5);
        double currentRMS = sqlite3_column_double(stmt, 6);
        double activep = sqlite3_column_double(stmt, 7);
        double reactivep = sqlite3_column_double(stmt, 8);
        double apparentp = sqlite3_column_double(stmt, 9);

        char buf[512];
        snprintf(buf, sizeof(buf), "{\"ID\": %d, \"Fecha\": \"%s\", \"Hora\": \"%s\", \"Voltaje RMS\": %f, \"Línea de Frecuencia\": %f, \"Factor de Potencia\": %f, \"Corriente RMS\": %f, \"Potencia Activa\": %f, \"Potencia Reactiva\": %f, \"Potencia Aparente\": %f},", id, date, time, voltageRMS, linef, powerf, currentRMS, activep, reactivep, apparentp);
        json_result = realloc(json_result, strlen(json_result) + strlen(buf) + 1);
        strcat(json_result, buf);
  }

  if (strlen(json_result) > 1) {
    json_result[strlen(json_result) - 1] = ']';  // Reemplaza la última coma por un corchete de cierre
  } else {
    json_result = realloc(json_result, strlen(json_result) + 2);
    strcat(json_result, "]");
  }

  sqlite3_finalize(stmt);
  return json_result;
}

//		Fin últimos 20 datos

// consulta específica por fechas
static char *query_database_date(sqlite3 *db, const char *start_date, const char *end_date) {
  sqlite3_stmt *stmt;
  char sql[256];
  snprintf(sql, sizeof(sql), "SELECT * FROM muestras WHERE Fecha BETWEEN '%s' AND '%s';", start_date, end_date);
  char *json_result = NULL;
  int rc;

  rc = sqlite3_prepare_v2(db, sql, -1, &stmt, 0);
  if (rc != SQLITE_OK) {
    fprintf(stderr, "Error al preparar la consulta: %s\n", sqlite3_errmsg(db));
    return NULL;
  }

  json_result = strdup("[");
    while ((rc = sqlite3_step(stmt)) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        const unsigned char *date = sqlite3_column_text(stmt, 1);
        const unsigned char *time = sqlite3_column_text(stmt, 2);
        double voltageRMS = sqlite3_column_double(stmt, 3);
        double linef = sqlite3_column_double(stmt, 4);
        double powerf = sqlite3_column_double(stmt, 5);
        double currentRMS = sqlite3_column_double(stmt, 6);
        double activep = sqlite3_column_double(stmt, 7);
        double reactivep = sqlite3_column_double(stmt, 8);
        double apparentp = sqlite3_column_double(stmt, 9);

        char buf[512];
        snprintf(buf, sizeof(buf), "{\"ID\": %d, \"Fecha\": \"%s\", \"Hora\": \"%s\", \"Voltaje RMS\": %f, \"Línea de Frecuencia\": %f, \"Factor de Potencia\": %f, \"Corriente RMS\": %f, \"Potencia Activa\": %f, \"Potencia Reactiva\": %f, \"Potencia Aparente\": %f},", id, date, time, voltageRMS, linef, powerf, currentRMS, activep, reactivep, apparentp);
        json_result = realloc(json_result, strlen(json_result) + strlen(buf) + 1);
        strcat(json_result, buf);
  }

  if (strlen(json_result) > 1) {
    json_result[strlen(json_result) - 1] = ']';  // Reemplaza la última coma por un corchete de cierre
  } else {
    json_result = realloc(json_result, strlen(json_result) + 2);
    strcat(json_result, "]");
  }

  sqlite3_finalize(stmt);
  return json_result;
}

//


static void fn(struct mg_connection *c, int ev, void *ev_data, void *fn_data) {
  if (ev == MG_EV_OPEN && c->is_listening) {
    s_config.url = strdup(MQTT_SERVER);
    s_config.pub = strdup(MQTT_PUBLISH_TOPIC);
    s_config.sub = strdup(MQTT_SUBSCRIBE_TOPIC);
  } else if (ev == MG_EV_HTTP_MSG) {
    struct mg_http_message *hm = (struct mg_http_message *) ev_data;
    if (mg_http_match_uri(hm, "/api/config/get")) {
      mg_http_reply(c, 200, "Content-Type: application/json\r\n",
                    "{%m:%m,%m:%m,%m:%m}\n", mg_print_esc, 0, "url",
                    mg_print_esc, 0, s_config.url, mg_print_esc, 0, "pub",
                    mg_print_esc, 0, s_config.pub, mg_print_esc, 0, "sub",
                    mg_print_esc, 0, s_config.sub);
    } else if (mg_http_match_uri(hm, "/api/config/set")) {
      struct mg_str json = hm->body;
      update_config(json, "$.url", &s_config.url);
      update_config(json, "$.pub", &s_config.pub);
      update_config(json, "$.sub", &s_config.sub);
      mg_http_reply(c, 200, "", "ok\n");
    } 
    /*else if (mg_http_match_uri(hm, "/api/data/get")) { // Agregar esta nueva ruta
      char *json_result = query_database(db); // Llama a la función para consultar la base de datos
      if (json_result != NULL) {
        mg_http_reply(c, 200, "Content-Type: application/json\r\n", "%s", json_result);
        free(json_result);
      } else {
        mg_http_reply(c, 500, "", "Error al consultar la base de datos\n");
      }
    }*/
    else if (mg_http_match_uri(hm, "/api/data/get")) {
    char start_date[256] = {0}, end_date[256] = {0};
    mg_http_get_var(&hm->query, "start", start_date, sizeof(start_date));
    mg_http_get_var(&hm->query, "end", end_date, sizeof(end_date));

    char *json_result = NULL;
    if (strlen(start_date) > 0 && strlen(end_date) > 0) { 
        json_result = query_database_date(db, start_date, end_date); // Llama a la función para consultar la base de datos
    } else {
        json_result = query_database_20_ultimos(db); // Llama a la función para consultar la base de datos
    }

    if (json_result != NULL) {
        mg_http_reply(c, 200, "Content-Type: application/json\r\n", "%s", json_result);
        free(json_result);
    } else {
        mg_http_reply(c, 500, "", "Error al consultar la base de datos\n");
    }
   }

    else {
      struct mg_http_serve_opts opts = {.root_dir = s_root_dir};
      mg_http_serve_dir(c, ev_data, &opts);
    }
  }
  (void) fn_data;
}


int main(void) {
  struct mg_mgr mgr;                            // Event manager
  mg_log_set(MG_LL_INFO);                       // Set to 3 to enable debug
  mg_mgr_init(&mgr);                            // Initialise event manager
  //Conexión a la base de datos
	//sqlite3 *db;
	int rc;

	rc = sqlite3_open("/home/pi/Documents/servidorTCP/sensor.db", &db);

	if (rc) {
    		fprintf(stderr, "No se puede abrir la base de datos: %s\n", sqlite3_errmsg(db));
    		return 0;
	} else {
    		fprintf(stderr, "Base de datos abierta exitosamente\n");
	}
	//sqlite3_close(db);
	
	//Consulta
	
 //Conexión termina
  mg_http_listen(&mgr, s_http_addr, fn, NULL);  // Create HTTP listener
  printf("Servidor ejecutándose en %s\n", s_http_addr);
  for (;;) mg_mgr_poll(&mgr, 1000);             // Infinite event loop
  mg_mgr_free(&mgr);
  return 0;
}
