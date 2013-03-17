using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace AcademyPopcorn
{
    /* problem 13 */
    public class ShootingEngine : Engine
    {

        ShootingRacket racket;

        public override void AddObject(GameObject obj) {
            var as_racket = obj as ShootingRacket;
            if (as_racket != null) {
                racket = as_racket;
            }
            base.AddObject(obj);
        }
        
        public ShootingEngine(IRenderer renderer, IUserInterface userInterface)
            : base(renderer, userInterface) {
        }

        public ShootingEngine(IRenderer renderer, IUserInterface userInterface, int sleep_time)
            : base(renderer, userInterface, sleep_time) {
        }

        public void ShootPlayerRacket() {
            var local = racket;
            if (local != null && local.CanShoot) {
                local.Shoot();
            }
        }


    }
}
