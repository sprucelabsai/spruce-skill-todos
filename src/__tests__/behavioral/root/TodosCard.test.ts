import {
	interactor,
	KeyboardKey,
	listAssert,
} from '@sprucelabs/heartwood-view-controllers'
import { fake } from '@sprucelabs/spruce-test-fixtures'
import { AbstractSpruceFixtureTest } from '@sprucelabs/spruce-test-fixtures'
import { test, assert, generateId } from '@sprucelabs/test-utils'
import SpyTodosCardViewController from '../../support/SpyTodosCardViewController'

@fake.login()
export default class TodosCardTest extends AbstractSpruceFixtureTest {
	protected static vc: SpyTodosCardViewController

	private static get newRowVc() {
		return this.listVc.getRowVc('new')
	}

	protected static async beforeEach() {
		await super.beforeEach()
		this.views.setController('todos.todos-card', SpyTodosCardViewController)
		this.vc = this.views.Controller(
			'todos.todos-card',
			{}
		) as SpyTodosCardViewController
	}

	@test()
	protected static async hittingEnterInNewInputAddsRow() {
		this.assertTotalRows(1)
		await this.setTodoInputToRandomValue()
		await this.pressKeyOnNewTodoInput('Enter')
		this.assertTotalRows(2)
		assert.isFalsy(this.newRowVc.getValue('todo'))
	}

	@test()
	protected static async hittingOtherKeysDoesNotAddRow() {
		await this.pressKeyOnNewTodoInput('w')
		this.assertTotalRows(1)
		await this.pressKeyOnNewTodoInput('h')
		this.assertTotalRows(1)
	}

	@test()
	protected static async pressingEnterDoesNotAddRowIfNoTodo() {
		await this.pressKeyOnNewTodoInput('Enter')
		this.assertTotalRows(1)
	}

	@test()
	protected static async pressingAddButtonWithTodoAddsRow() {
		this.setTodoInputToRandomValue()
		await this.clickAddButton()
		this.assertTotalRows(2)
	}

	@test()
	protected static async pressingAddWithoutTodoDoesNotAdd() {
		await this.clickAddButton()
		this.assertTotalRows(1)
	}

	@test()
	protected static async newTodoRowRendersTodoInputContent() {
		const todo = await this.addRandomTodo()
		listAssert.rowRendersContent(this.listVc, 1, todo)
	}

	@test()
	protected static async addedTodoRowHasCheckbox() {
		await this.addRandomTodo()
		listAssert.rowRendersCheckBox(this.listVc, 1)
	}

	@test()
	protected static async todoRowHasDeleteButton() {
		await this.addRandomTodo()
		listAssert.rowRendersButton(this.listVc, 1, 'delete')
	}

	private static async addRandomTodo() {
		const todo = await this.setTodoInputToRandomValue()
		await this.clickAddButton()
		return todo
	}

	private static async clickAddButton() {
		await interactor.clickButtonInRow(this.listVc, 'new', 'add')
	}

	private static async setTodoInputToRandomValue() {
		const value = generateId()
		await this.newRowVc.setValue('todo', value)
		return value
	}

	private static async pressKeyOnNewTodoInput(key: KeyboardKey) {
		await interactor.keyDownOnInputInRow({
			cell: 0,
			key,
			vc: this.newRowVc,
		})
	}

	private static assertTotalRows(expected: number) {
		const actual = this.listVc.getTotalRows()
		assert.isEqual(
			actual,
			expected,
			`Didn't get expected total rows!\n\nExpected: ${expected}\nActual: ${actual}`
		)
	}

	private static get listVc() {
		return this.vc.getListVc()
	}
}
