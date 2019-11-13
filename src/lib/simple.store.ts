import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// When updating the state, the caller has the option to define the new state partial
// using a a callback. This callback will provide the current state snapshot.
interface SetStateCallback<T> {
	( currentState: T ): Partial<T>;
}

export class SimpleStore<StateType = any> {

	private stateSubject: BehaviorSubject<StateType>;

	// I initialize the simple store with the givne initial state value.
	constructor( initialState: StateType ) {

		this.stateSubject = new BehaviorSubject( initialState );

	}

	// ---
	// PUBLIC METHODS.
	// ---

	// I get the current state as a stream (will always emit the current state value as
	// the first item in the stream).
	public getState(): Observable<StateType> {

		return( this.stateSubject.asObservable() );

	}


	// I get the current state snapshot.
	public getStateSnapshot() : StateType {

		return( this.stateSubject.getValue() );

	}


	// I return the given top-level state key as a stream (will always emit the current
	// key value as the first item in the stream).
	public select<K extends keyof StateType>( key: K ) : Observable<StateType[K]> {
		return this.stateSubject.map((state: StateType) => {
			return( state[ key ] );
		}).distinctUntilChanged();

	}


	// I move the store to a new state by merging the given (or generated) partial state
	// into the existing state (creating a new state object).
	// --
	// CAUTION: Partial<T> does not currently project against "undefined" values. This is
	// a known type safety issue in TypeScript.
	public setState( updater: SetStateCallback<StateType> | Partial<StateType> ): void {

		const currentState = this.getStateSnapshot();
		// If the updater is a function, then it will need the current state in order to
		// generate the next state. Otherwise, the updater is the Partial<T> object.
		// --
		// NOTE: There's no need for try/catch here since the updater() function will
		// fail before the internal state is updated (if it has a bug in it). As such, it
		// will naturally push the error-handling to the calling context, which makes
		// sense for this type of workflow.
		const partialState = ( updater instanceof Function )
			? updater( currentState )
			: updater
		;
		const nextState = Object.assign( {}, currentState, partialState );

		this.stateSubject.next( nextState );

	}

	public setNextState(nextState: StateType) {
		this.stateSubject.next( nextState );
	}

}
