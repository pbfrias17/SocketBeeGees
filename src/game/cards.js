const GetPower = (card) => {
  return card.power;
};

const ExecutePower = (power, resolveCallback) => {
  var prereqs = [];
  return ResolveEffects(power, prereqs, 0, resolveCallback);
};

const ResolveEffect = (effect, resolvedCallback) => {
  var effectPromise = new Promise((resolve, reject) => {
    console.log(effect.effect);
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  effectPromise.then((result) => {  
    //prereqs[idx] = result;
    //console.log('\tresolve = ' + result);
    resolvedCallback(result);
    // if (idx != power.length - 1) {
    //   idx++;
    //   if (power[idx].prereq && !CheckPrereq(prereqs, power[idx].prereq)) {
    //     console.log('cannot execute next effect: prereq not met');
    //   } else {
    //     ResolveEffects(power, prereqs, idx);
    //   }
    // } else {
    //   console.log('done resolving all effects');
    // }
  });
};

const CheckPrereq = (prereqs, idx) => {
  return prereqs[idx];
};

export { ExecutePower, ResolveEffect };