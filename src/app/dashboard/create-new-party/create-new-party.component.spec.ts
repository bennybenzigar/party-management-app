import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPartyComponent } from './create-new-party.component';

describe('CreateNewPartyComponent', () => {
  let component: CreateNewPartyComponent;
  let fixture: ComponentFixture<CreateNewPartyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateNewPartyComponent]
    });
    fixture = TestBed.createComponent(CreateNewPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
