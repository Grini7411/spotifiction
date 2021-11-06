import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSpotifictionComponent } from './player-spotifiction.component';

describe('PlayerComponent', () => {
  let component: PlayerSpotifictionComponent;
  let fixture: ComponentFixture<PlayerSpotifictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerSpotifictionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSpotifictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
