
describe("decidr.report", function () {
    it("converts a decision to an array of ranked options", function () {
        var data = fixtures.getSavedReport();

        var result = dcidr.report(data);

        expect(result).toEqual([
               {
                   "option": "Gettysburg",
                   "score": 0.2895601779244231
               },
               {
                   "option": "Beach",
                   "score": 0.2751699628390909
               },
               {
                   "option": "Ski Trip",
                   "score": 0.23575502391589837
               },
               {
                   "option": "NYC",
                   "score": 0.1995148353205874
               }
        ]);
    });
});
