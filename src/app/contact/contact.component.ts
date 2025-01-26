import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  onSubmit(contactForm: any) {
    if (contactForm.valid) {
      console.log('Form Submitted!', contactForm.value);
      // Add your form submission logic here, like sending data to the server
      contactForm.reset();
      alert('Thank you for contacting us! We will get back to you soon.');
    }
  }
}
