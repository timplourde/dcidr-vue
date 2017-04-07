import generateReport from './generate-report';

class CriteriaComparison {
    constructor (critA, critB, rank) {
        this.criteriaA = critA;
        this.criteriaB = critB;
        this.rank = rank || null;
        this.hash = `${this.criteriaA}|${this.criteriaB}`;
    }
}

class OptionComparison {
     constructor(criteria, optionA, optionB, rank) {
        this.criteria = criteria;
        this.optionA = optionA;
        this.optionB = optionB;
        this.rank = rank || null;
        this.hash = `${this.criteria}|${this.optionA}|${this.optionB}`;
    }
}

class Decision {
    constructor(model) {

        this.gates = {
            hasEnoughOptions: false,
            hasEnoughCriteria: false,
            allCriteriaComparisonsRanked: false,
            allOptionComparisonsRanked: false
        };

        if(!model) {
            this.id = (new Date()).getTime().toString();
            this.name = null;
            this.date = new Date();
            this.options = [];
            this.criteria = [];
            this.optionComparisons = [];
            this.criteriaComparisons = [];
            this.report = [];
        } else {
            this.id = model.id;
            this.name = model.name;
            this.date = model.date;
            this.options = model.options;
            this.criteria = model.criteria;
            this.optionComparisons = model.optionComparisons.map( c=>{
              return new OptionComparison(c.criteria, c.optionA, c.optionB, c.rank);  
            });
            this.criteriaComparisons = model.criteriaComparisons.map( c=>{
              return new CriteriaComparison(c.criteriaA, c.criteriaB, c.rank);  
            });
            this.report = model.report;
            updateGates(this);
        }
        
    }
    addOption(name){
        if(this.options.find((o)=> o.toLowerCase().trim() === name.toLowerCase().trim())){
            return;
        }
        this.options.push(name);
        optionsChanged(this);
        this.updateReport();
    }
    removeOption(name){
        this.options = this.options.filter(opt => {return opt != name;});
        optionsChanged(this);
        this.updateReport();
    }
    addCrit(name){ 
        if(this.criteria.find((o)=> o.toLowerCase().trim() === name.toLowerCase().trim())){
            return;
        }
        this.criteria.push(name);
        criteriaChanged(this);
        this.updateReport();
    }
    removeCrit(name){
        this.criteria = this.criteria.filter(crit => {return crit != name;});
        criteriaChanged(this);
        this.updateReport();
    }
    updateOptionComparisonRank(hash, newRank){
        let comparison = this.optionComparisons.find( comp => {
            return comp.hash === hash;
        });
        comparison.rank = newRank;
        updateGates(this);
        this.updateReport();
    }
    updateCriteriaComparisonRank(hash, newRank){
        let comparison = this.criteriaComparisons.find( comp => {
            return comp.hash === hash;
        });
        comparison.rank = newRank;
        updateGates(this);
        this.updateReport();
    }
    updateReport(){
        if(this.gates.hasEnoughCriteria 
            && this.gates.hasEnoughOptions
            && this.gates.allCriteriaComparisonsRanked 
            && this.gates.allOptionComparisonsRanked){
            this.report = generateReport(JSON.parse(JSON.stringify(this)));
        } else {
            this.report = [];
        }
    }
}

// Decision private methods
function updateGates(instance){
    instance.gates.hasEnoughOptions = instance.options.length >= 2;
    instance.gates.hasEnoughCriteria = instance.criteria.length >= 2;
    instance.gates.allOptionComparisonsRanked = instance.optionComparisons.every(c=>c.rank != null);
    instance.gates.allCriteriaComparisonsRanked = instance.criteriaComparisons.every(c=>c.rank != null);
}

function optionsChanged(instance){
    updateOptionComparisons(instance);
    updateGates(instance);
}

function criteriaChanged(instance){
    updateCriteriaComparisons(instance);
    updateOptionComparisons(instance);
    updateGates(instance);
}

function updateCriteriaComparisons(instance){
    let proposedComparisons = getProposedCriteriaComparisons(instance.criteria);
    instance.criteriaComparisons = mergeComparisons(instance.criteriaComparisons, proposedComparisons);
}

function updateOptionComparisons(instance){
    let proposedComparisons = getProposedOptionComparisons(instance.options, instance.criteria);
    instance.optionComparisons = mergeComparisons(instance.optionComparisons, proposedComparisons);
}

// pure functions
function getProposedCriteriaComparisons(criteria){
    return criteria.reduce( (accum, crit, index) => {
        let comparisons = [];
        for (var i = index + 1; i < criteria.length; i++) {
            comparisons.push(new CriteriaComparison(crit, criteria[i]));
        }
        return accum.concat(comparisons);
    }, []);
}

function getProposedOptionComparisons(options, criteria){
    return criteria.reduce( (accumCrit, crit) => {
        // get all OptionComparisons for this criteria
        let allOptionComparisons = options.reduce( (accumOpt, option, index) => {
            let optionComparisons = [];
            for (var i = index + 1; i < options.length; i++) {
                optionComparisons.push(new OptionComparison(crit, option, options[i]));
            }
            return accumOpt.concat(optionComparisons);
        }, []);
        return accumCrit.concat(allOptionComparisons);
    }, []);
}

function sortByHash(a, b) {
    return a.hash > b.hash ? -1 : (a.hash < b.hash ? 1 : 0);
};

function comparisonArrayToMap(comparisonArray){
    // key is the .hash
    let map = new Map();
    comparisonArray.forEach(comp => {
        map.set(comp.hash, comp);
    });
    return map;
}

function mergeComparisons(currentComparisons, proposedComparisons){
    let currentMap = comparisonArrayToMap(currentComparisons);
    return proposedComparisons.reduce((accum, proposed) => {
       accum.push(currentMap.has(proposed.hash) ? currentMap.get(proposed.hash) : proposed);
       return accum;
    }, [])
    .sort(sortByHash);
}

export default Decision;