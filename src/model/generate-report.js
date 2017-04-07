
const rankMap = new Map([
    ['mlt', 0.1],
    ['lt', 0.2],
    ['eq', 1],
    ['gt', 5],
    ['mgt', 10]
]);

function convertRanks(ranks) {
    return ranks.map(r => {
        r.rank = rankMap.get(r.rank);
        return r;
    });
}

function calcRdvs(comps, keyA, keyB) {
    let rdvs = new Map(), 
        total = 0;

    // add inverses
    comps = comps.concat(comps.map( comp => {
        return {
            [keyB]: comp[keyA],
            [keyA]: comp[keyB],
            rank : 1 / comp.rank
        };
    }));

    comps.forEach( comp => {
        let key = comp[keyA];
        total += comp.rank;
        if (!rdvs.has(key)) {
            rdvs.set(key, comp.rank);
        } else {
            let currentVal = rdvs.get(key);
            rdvs.set(key, currentVal + comp.rank);
        }
    });

    rdvs.forEach((val, key) => {
        val = val / total;
        rdvs.set(key, val);
    });

    return rdvs;
}

function generateReport(report) {
    let critComps = convertRanks(report.criteriaComparisons);
    let optionComps = convertRanks(report.optionComparisons);
    let optionRdvs = new Map();
    let optionTotals = new Map();
    let grandTotal = 0;

    let criteriaRdvs = calcRdvs(critComps, 'criteriaA', 'criteriaB');

    report.criteria.forEach(crit => {
        let relevantRanks = optionComps.filter(oc =>{
            return oc.criteria === crit;
        });
        optionRdvs.set(crit, calcRdvs(relevantRanks, 'optionA', 'optionB'));
    });

    report.options.forEach(opt => {
        optionTotals.set(opt, 0);
        criteriaRdvs.forEach( (critRdv, crit) => {
            let optionRdv = optionRdvs.get(crit).get(opt);
            let adjustedRdv = optionRdv * critRdv;
            let currentOptionTotal = optionTotals.get(opt);
            optionTotals.set(opt, currentOptionTotal + adjustedRdv);
            grandTotal += adjustedRdv;
        });
    });

    return [...optionTotals.keys()].map( option => {
        return {
            option,
            score: optionTotals.get(option)
        };
    }).sort((a,b) =>{
        return a.score > b.score ? -1 : (a.score < b.score ? 1 : 0);
    });

}

export default generateReport;