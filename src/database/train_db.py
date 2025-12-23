from src.logic.graph_bfs import Graph, TrainWeight
import json
import os

class TrainDB:
    def __init__(self, path: str, fetch_data: bool = True):
        self.folder_path = path
        self.__data = Graph()
        self.__w_table = {}

        if fetch_data:
            self.fetch()

    def fetch(self, intersection_filename: str = "_intersections.json") -> None:
        with os.scandir(self.folder_path) as entries:
            for entry in entries:
                ext = entry.name[entry.name.find('.') + 1:]
                #_intersections.json is handled separately
                if entry.is_file() and ext == 'json' and entry.name[0] != '_':
                    temp_dict = self.fetch_entry(entry.name)
                    self.__add_stations(temp_dict)
       
        intersection_dict = self.fetch_entry(intersection_filename)
        self.__add_intersections(intersection_dict)
        
    def fetch_entry(self, entry_name: str) -> dict:
        temp_dict = {}
        entry_path = self.abs_path(entry_name)
        with open(entry_path, 'r') as file:
            temp_dict = json.load(file)
        return temp_dict

    def __add_stations(self, stations: list[str]) -> None:
        """
            In this case, the stations are assumed to be connected end-to-end
            i.e. ["A", "B", "C"], the graph looks like A <-> B <-> C
        """

        train_system = stations["tag"]
        station_names = stations["stations"]
        station_count = len(station_names)

        for station in station_names:
            self.__data.add_vertex(station, train_system)
        
        for s in range(station_count - 1):
            from_station = station_names[s]
            to_station = station_names[s + 1]
            self.__data.add_edge(from_station, to_station)

        for n in range(station_count):
            for m in range(station_count):
                from_station = station_names[n]
                to_station = station_names[m]

                weight = TrainWeight(
                    stations["stored value"][from_station][m],
                    stations["single journey"][from_station][m],
                    0
                )

                if not(from_station in self.__w_table):
                    self.__w_table[from_station] = {}
                self.__w_table[from_station][to_station] = weight
            
    def __add_intersections(self, intersects: list[dict]) -> None:
        for it in intersects:
            from_station = it["station1"]
            to_station = it["station2"]

            self.__data.add_edge(
                from_station,
                to_station,
                two_way = True
            )

            weight = TrainWeight(
                it["stored value"],
                it["single journey"],
                it["time"]
            )

            self.__w_table[from_station][to_station] = weight
            self.__w_table[to_station][from_station] = weight

    def get_graph(self) -> Graph:
        return self.__data

    def get_weights(
        self,
        from_station: str | None = None,
        to_station: str | None = None
    ) -> dict[str, dict[str, TrainWeight]] | TrainWeight:
        if from_station is None or to_station is None:
            return self.__w_table
        return self.__w_table[from_station][to_station]

    def abs_path(self, filename: str, ext: str = "") -> str:
        temp_path = self.folder_path + '/' + filename
        if ext:
            temp_path += '.' + ext
        return temp_path
