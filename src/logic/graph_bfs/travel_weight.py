class TrainWeight:
    def __init__(
        self,
        stored: int = 0,
        single: int = 0,
        time: int = 0
    ):
        self.stored = stored
        self.single = single
        self.time = time

    def __iadd__(self, weight) -> None:
        self.stored += weight.stored
        self.single += weight.single
        self.time += weight.time

    def __isub__(self, weight) -> None:
        self.stored -= weight.stored
        self.single -= weight.single
        self.time -= weight.time
