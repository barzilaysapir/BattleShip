import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IFormInput, IGameLevelData } from 'src/app/layout/home/home.interface';

@Component({
  selector: 'app-new-game-form',
  templateUrl: './new-game-form.component.html',
  styleUrls: ['./new-game-form.component.scss']
})

export class NewGameFormComponent implements OnInit {

  @Input() gameLevelFormGroup: FormGroup;
  @Input() defaultValues: IGameLevelData;
  @Input() formInputs: IFormInput[];

  @Output() newGameEmit: EventEmitter<IGameLevelData | undefined> = new EventEmitter<IGameLevelData | undefined>();

  public tooManyShips: boolean;

  constructor() {
    this.gameLevelFormGroup = {} as FormGroup;
    this.defaultValues = {} as IGameLevelData;
    this.formInputs = [];
    this.tooManyShips = false;
  }

  ngOnInit(): void {
  }

  public onInputValueChange(): void {
    const inputs = this.gameLevelFormGroup.value;
    
    this.tooManyShips =
      (inputs.rows || this.defaultValues.rows) * (inputs.columns || this.defaultValues.columns) / 2
      <=
      (inputs.amountOfShips || this.defaultValues.amountOfShips);
  }

  public newGameSubmitted(gameLevelFormGroup: FormGroup): void {
    Object.values(gameLevelFormGroup.controls).map(control => control.errors && control.reset());

    if (gameLevelFormGroup.pristine) {
      this.newGameEmit.emit();
    } else {
      this.newGameEmit.emit(gameLevelFormGroup.value);
    }
  }
}
