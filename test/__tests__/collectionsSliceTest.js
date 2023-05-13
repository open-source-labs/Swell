/**
 * @todo - Refactor code for DRY principle
 * @todo - Check for possible edge cases
 * @todo - Look into branch coverage, currently sitting at ~50%, but this may
 * be due to the actual slice syntax using if statements without a default return case.
 */

import collectionsSliceReducer, 
    { collectionsReplaced, 
        collectionDeleted, 
        collectionAdded,
        collectionUpdated } from '../../src/client/toolkit-refactor/slices/collectionsSlice';

describe('collectionsSliceReducer', () => {
    let initialState;

    beforeEach(() => {
        initialState = [{
            id: 1,
            name: 'collectionTestOne',
            createdAt: '2022-01-01T00:00:00.000Z',
            modifiedAt: '2023-02-01T00:00:00.000Z',
            reqResArray: [{
                id: 123
            }],
            reqResRequest: [{
                body: 'reqResRequest collections test one'
            }]
        }];
    });

    describe('collectionsReplaced', () => {
        it('should replace the current collections obj with a new one', () => {
            const newCollectionState = [{
                id: 2,
                name: 'collectionTestTwo',
                createdAt: '2022-01-01T00:00:00.000Z',
                modifiedAt: '2023-02-01T00:00:00.000Z',
                reqResArray: [{
                    id: 321
                }],
                reqResRequest: [{
                    body: 'reqResRequest collections test two'
                }]
            }];

            const newState = collectionsSliceReducer(
                initialState, 
                collectionsReplaced(newCollectionState)
            );

            expect(newState).toBe(newCollectionState);
        });
    });

    describe('collectionDeleted', () => {
        it('should delete the requested collection object by ID and position index', () => {
            const newCollectionState = [{
                id: 2,
                name: 'collectionTestTwo',
                createdAt: '2022-01-01T00:00:00.000Z',
                modifiedAt: '2023-02-01T00:00:00.000Z',
                reqResArray: [{
                    id: 321
                }],
                reqResRequest: [{
                    body: 'reqResRequest collections test two'
                }]
            }];
            initialState.push(newCollectionState);
            const newState = collectionsSliceReducer(
                initialState, 
                collectionDeleted(initialState[0])
            );

            expect(newState.length).toBe(1);
        });
    })

    describe('collectionAdded', () => {
        it('should add a new collections object to the beginning of the state', () => {
            const newCollectionState = [{
                id: 2,
                name: 'collectionTestTwo',
                createdAt: '2022-01-01T00:00:00.000Z',
                modifiedAt: '2023-02-01T00:00:00.000Z',
                reqResArray: [{
                    id: 321
                }],
                reqResRequest: [{
                    body: 'reqResRequest collections test two'
                }]
            }];

            const newState = collectionsSliceReducer(
                initialState, 
                collectionAdded(newCollectionState)
            );

            expect(newState[0]).toBe(newCollectionState);
        });
    });

    describe('collectionsUpdated', () => {
        it('should update the request collection object by ID', () => {
            const newCollectionState = [{
                id: 2,
                name: 'collectionTestOne',
                createdAt: '2022-01-01T00:00:00.000Z',
                modifiedAt: '2023-02-01T00:00:00.000Z',
                reqResArray: [{
                    id: 321
                }],
                reqResRequest: [{
                    body: 'reqResRequest collections test two'
                }]
            }];

            const newState = collectionsSliceReducer(
                initialState, 
                collectionUpdated(newCollectionState[0])
            );

            expect(newState[0]).toBe(newCollectionState[0]);
            expect(newState.length).toBe(1);

        });
    });
});