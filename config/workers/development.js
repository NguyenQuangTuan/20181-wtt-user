let workers = [
  {
    group_id: 'wtt-user-worker',
    prefix_client_id: 'user-worker',
    connection_string: '206.189.191.22:9092',
    topics: ['tuan-wtt'],
    client_instance: 1,
    parser_instances: 'TEXT,JSON',
    timeout: null,
    handler: 'user_handler'
  },
]

module.exports = workers
