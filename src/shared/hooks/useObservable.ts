import type { Observable, Subscription } from "rxjs";

import { useEffect, useState } from "react";

export function useObservable<T>(obs: Observable<T>, initial: T): T {
    const [value, setValue] = useState(initial);

    useEffect(() => {
        const sub: Subscription = obs.subscribe(setValue);
        return () => sub.unsubscribe();
    }, [obs]);

    return value;
}