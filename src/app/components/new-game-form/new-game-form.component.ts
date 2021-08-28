import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IGameLevelData } from 'src/app/layout/home/home.interface';

@Component({
  selector: 'app-new-game-form',
  templateUrl: './new-game-form.component.html',
  styleUrls: ['./new-game-form.component.scss']
})

export class NewGameFormComponent implements OnInit {

  @Input() gameLevelFormGroup: FormGroup;
  @Input() defaultValues: IGameLevelData;

  @Output() newGameEmit: EventEmitter<IGameLevelData | undefined> = new EventEmitter<IGameLevelData | undefined>();

  public tooManyShips: boolean;

  constructor() {
    this.gameLevelFormGroup = {} as FormGroup;
    this.defaultValues = {} as IGameLevelData;
    this.tooManyShips = false;
  }

  ngOnInit(): void {
  }

  public onValueChange(): void {
    this.tooManyShips = (this.gameLevelFormGroup.value.rows || this.defaultValues.rows)
      * (this.gameLevelFormGroup.value.columns || this.defaultValues.columns)
      / 2 < (this.gameLevelFormGroup.value.amountOfShips || this.defaultValues.amountOfShips);
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
