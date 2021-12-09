const signalPatterns = {
  zero: { pattern: '', positions: zeroPositions },
  one: {
    pattern: i.patterns.find(p => p.length === ONE_LENGTH),
    postiions: onePositions
  },
  two: { pattern: '', postiions: twoPositions },
  three: { pattern: '', postiions: threePositions },
  four: {
    pattern: i.patterns.find(p => p.length === FOUR_LENGTH),
    postiions: fourPositions
  },
  five: { pattern: '', postiions: fivePositions },
  six: { pattern: '', postiions: sixPositions },
  seven: {
    pattern: i.patterns.find(p => p.length === SEVEN_LENGTH),
    postiions: sevenPositions
  },
  eight: {
    pattern: i.patterns.find(p => p.length === EIGHT_LENGTH),
    postiions: eightPositions
  },
  nine: { pattern: '', postiions: ninePositions }
}

   // FIVES: 
    // - 3 has C & F
    // - 5 has B & F
    // - 2 has C & E
    const fives = i.patterns.find(p => p.length === 5)

    // SIXES: 


    const lengthFivePatterns = i.patterns.filter(p => p.length === 5)
    const lengthSixPatterns = i.patterns.filter(p => p.length === 6)

    const cAndFPossibles = (...params) => {
      return params.reduce(
        (acc, cur) => acc.filter(pos => cur.includes(pos)),
        allPositions
      )
    }


  const arrayIntersection = (...arrays) =>
  arrays.reduce((acc, cur) => acc.filter(a => cur.includes(a)))


      // known digits: all share C & F
      const knownDigits = Object.keys(signalPatterns).filter(
        (k, idx) => k[idx].pattern !== ''
      )
  
   

      const cf = cAndFPossibles(one, four, seven, eight)
      cCandidates.push(cf)
      fCandidates.push(cf)
