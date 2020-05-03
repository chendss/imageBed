from tools import wirte_file, read_file, get
import pydash


class DB:
    def __init__(self, path):
        self.data = read_file(path)
        self.path = path

    def get(self, key):
        result = get(self.data, key, None)
        return result

    def insert(self, key, value):
        pydash.set_(self.data, key, value)
        wirte_file(self.path, self.data)

    def insert_list(self, key, values):
        target = get(self.data, key, [])
        target.extend(values)
        self.insert(key, target)
