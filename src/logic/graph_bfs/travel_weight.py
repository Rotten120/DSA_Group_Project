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

    def __add__(self, weight):
        return TrainWeight(
            stored = self.stored + weight.stored,
            single = self.single + weight.single,
            time = self.time + self.time
        )

    def __sub__(self, weight):
        return TrainWeight(
            stored = self.stored - weight.stored,
            single = self.single - weight.single,
            time = self.time - self.time
        )
