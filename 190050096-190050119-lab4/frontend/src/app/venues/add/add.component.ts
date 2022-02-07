import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddVenue } from '../../interfaces/venues';
import { VenueaddService } from '../../services/venueadd.service'

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  data!: AddVenue;

  venueaddForm = new FormGroup({
    venue_name: new FormControl('', Validators.required),
    city_name: new FormControl('', Validators.required),
    country_name: new FormControl('', Validators.required),
    capacity: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
  });

  constructor(private apiService: VenueaddService) { }

  ngOnInit(): void {
  }

  OnSubmit() {
    this.apiService.addVenue(this.venueaddForm.value).subscribe({
      error: (e) => alert('Oops Sorry, something went wrong'),
      complete: () => { this.venueaddForm.reset(), alert("venue added successfully") }
    });

  }

  getErrorMessage(e: string) {
    if (e == 'capacity') {
      return this.venueaddForm.get(e)!.hasError('required') ? 'Field is required' : 'Number Only';
    }
    else return this.venueaddForm.get(e)!.hasError('required') ? 'Field is required' : '';
  }
}
