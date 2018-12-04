user = {
	"settings": {
		"index": {
			"number_of_shards": 1,
			"number_of_replicas": 1
		},
		"analysis": {
			"analyzer": {
				"autocomplete": {
					"tokenizer": "prd_edge_ngram",
					"filter": [
						"standard",
						"lowercase"
					]
				},
				"search": {
					"tokenizer": "standard",
					"filter": [
						"standard",
						"lowercase",
						"prd_stop_words"

					]
				},
				"lowercase": {
					"tokenizer": "lowercase"
				}
			},
			"tokenizer": {
				"prd_edge_ngram": {
					"type": "edge_ngram",
					"min_gram": 1,
					"max_gram": 10,
					"token_chars": [
						"letter",
						"digit",
						"punctuation"
					]
				}
			},
			"filter": {
				"prd_stop_words": {
					"type": "stop",
					"stopwords": "_english_"
				}
			}
		}
	},
	"mappings": {
		"_doc": {
			"properties": {
				"user_id": {
					"type": "keyword"
				},
				"hash": {
					"type": "keyword"
				},
				"salt": {
					"type": "keyword"
				},
				"email": {
					"type": "keyword"
				},
				"full_name": {
					"type": "text",
					"analyzer": "search",
					"fields": {
						"autocomplete": {
							"type": "text",
							"analyzer": "autocomplete"
						},
						"keyword": {
							"type": "keyword"
						}
					}
				},
				"avatar_url": {
					"type": "keyword"
				}
			}
		}
	}
}
