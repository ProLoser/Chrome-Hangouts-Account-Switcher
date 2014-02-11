/**
 * What a "Step" is:
 *
 * imagine in our patterns, there is "my issues",
 * then "my" is represented as a Step, with "issues" as a child Step
 *
 * Each Step know it's label (can be "my" or "issues" here), it also knows about
 * - it's parent
 * - it's children
 * - it's level (issues' level is 1 here)
 * - it's pattern (regex or string)
 * - it's value (which is the original object that is specified in the patterns object up there)
 *      I use the value to get the "suggest" and "decide" function for example
 *      Also, any "match" or "startsWith" function on the value overwrites the default ones
 *
 */
var Step = (function () {

    function Step(label, value, level, parent) {
        this.label = label;
        this.value = value;
        this.level = level;
        this.parent = parent || null;

        this.pattern = value.pattern || label;
        this.children = [];
        if (value.match) {
            this.match = value.match;
        }
        if (value.startsWith) {
            this.startsWith = value.startsWith;
        }
        _.forEach(value.children, function (childVal, childKey) {
            this.children.push(new Step(childKey, childVal, this.level + 1, this));
        }, this);
    }

    Step.prototype = {
        // does this Step match those args?
        // only called when parent matches too
        match: function (args, text) {
            if (_.isRegExp(this.pattern)) {
                return this.pattern.test(args[this.level]);
            } else {
                return this.pattern === args[this.level];
            }
        },
        // only called when parent matches too
        startsWith: function (args, text) {
            if (_.isRegExp(this.pattern)) {
                return this.pattern.test(args[this.level]);
            } else {
                return this.pattern.indexOf(args[this.level]) === 0;
            }
        },

        // gives suggestions for self and children (if there are still other args, children come first)
        suggest: function (args, text) {
            var suggestions = [];
            if (this.level === args.size0) {
                if (this.startsWith(args, text) && "suggest" in this.value) {
                    suggestions = suggestions.concat(this.getSuggestValue(args, text));
                }
                suggestions = suggestions.concat(this.getChildSuggest(args, text));
            } else if (this.level < args.size0) {
                if (this.match(args, text)) {
                    suggestions = suggestions.concat(this.getChildSuggest(args, text));
                    if ("suggest" in this.value) {
                        suggestions = suggestions.concat(this.getSuggestValue(args, text));
                    }
                }
            }
            return suggestions;
        },
        //gives the suggestions of children
        getChildSuggest: function (args, text) {
            var suggestions = [];
            _.forEach(this.children, function (childStep) {
                suggestions = suggestions.concat(childStep.suggest(args, text));
            });
            return suggestions;
        },

        //gives the decision of self, or children if there are other args
        decide: function (args, text) {
            var childDecision;
            if (this.match(args, text)) {
                if (this.level === args.size0) {
                    if ("decide" in this.value) {
                        return this.getDecideValue(args, text);
                    }

                } else if (this.level < args.size0) {
                    for (var i = 0; i < this.children.length; i++) {
                        childDecision = this.children[i].decide(args, text);
                        if (!_.isUndefined(childDecision)) {
                            return childDecision;
                        }
                    }
                }
            }
            return undefined;
        },

        //getting the "road" to get to this step (example: "my issues")
        getRoad: function () {
            if (this.road) return this.road;

            var steps = [], aStep = this;
            do {
                steps.unshift(aStep.label);
            } while (aStep = aStep.parent);

            return this.road = steps.join(" ");
        },

        getSuggestValue: function (args, text) {
            if (_.isFunction(this.value.suggest)) {
                return this.value.suggest.call(this, args, text);
            } else {
                return this.value.suggest;
            }
        },
        getDecideValue: function (args, text) {
            if (_.isFunction(this.value.decide)) {
                return this.value.decide.call(this, args, text);
            } else {
                return this.value.decide;
            }
        }
    };

    return Step;

}());