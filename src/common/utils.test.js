// Copyright (c) Microsoft. All rights reserved.
import { makeShallowObject } from './utils'

describe('makeShallowObject function', () => {
    it('should create a shallow object', () => {
        const shallow = makeShallowObject({
          'a': {
            'b': [],
            'c': 14,
          },
          'd': 5,
        });
        expect(Object.keys(shallow).length).toBe(3);
        expect(shallow['a.b']).toBe('[]');
        expect(shallow['a.c']).toBe('14');
        expect(shallow['d']).toBe('5');
    });
});
